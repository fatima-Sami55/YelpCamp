import { useEffect, useRef, useState } from "react";
import { configAPI } from "../services/api";

function toFeatureCollection(campgrounds) {
  return {
    type: "FeatureCollection",
    features: campgrounds
      .filter((camp) => camp.geometry?.coordinates?.length === 2)
      .map((camp) => ({
        type: "Feature",
        geometry: camp.geometry,
        properties: {
          id: camp._id,
          title: camp.title,
          location: camp.location,
          popUpMarkup: `<strong><a href="/campgrounds/${camp._id}">${camp.title}</a></strong><p>${camp.description || ""}</p>`,
        },
      })),
  };
}

export default function CampgroundClusterMap({ campgrounds }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [mapToken, setMapToken] = useState("");

  useEffect(() => {
    let ignore = false;

    configAPI.getMapboxToken().then((response) => {
      if (!ignore) setMapToken(response.data.token);
    }).catch(() => {
      if (!ignore) setMapToken("");
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!mapToken || !window.mapboxgl || !containerRef.current) return;

    if (mapRef.current) {
      const source = mapRef.current.getSource("campgrounds");
      if (source) source.setData(toFeatureCollection(campgrounds));
      return;
    }

    window.mapboxgl.accessToken = mapToken;
    const map = new window.mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-103.59179687498357, 40.66995747013945],
      zoom: 3,
    });

    mapRef.current = map;
    map.addControl(new window.mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      map.addSource("campgrounds", {
        type: "geojson",
        data: toFeatureCollection(campgrounds),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#00BCD4", 10, "#2196F3", 30, "#3F51B5"],
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "clusters", (event) => {
        const features = map.queryRenderedFeatures(event.point, { layers: ["clusters"] });
        const clusterId = features[0].properties.cluster_id;
        map.getSource("campgrounds").getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      });

      map.on("click", "unclustered-point", (event) => {
        const coordinates = event.features[0].geometry.coordinates.slice();
        const { popUpMarkup } = event.features[0].properties;

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new window.mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [campgrounds, mapToken]);

  return <div id="cluster-map" ref={containerRef} />;
}
