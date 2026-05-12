import { useEffect, useRef, useState } from "react";
import { configAPI } from "../services/api";

export default function CampgroundMap({ campground }) {
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
    const coordinates = campground?.geometry?.coordinates;
    if (!mapToken || !window.mapboxgl || !containerRef.current || !coordinates) return;

    window.mapboxgl.accessToken = mapToken;
    const map = new window.mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      zoom: 10,
    });

    mapRef.current = map;
    map.addControl(new window.mapboxgl.NavigationControl(), "bottom-right");

    new window.mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(
        new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
      )
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [campground, mapToken]);

  return <div id="map" ref={containerRef} />;
}
