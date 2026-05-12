import { useEffect, useRef, useState } from "react";
import { configAPI } from "../services/api";

export default function CampgroundMap({ campground }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const popupRef = useRef(null);
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

    const popupHtml = `<h3>${campground.title}</h3><p>${campground.location}</p>`;

    if (mapRef.current && markerRef.current && popupRef.current) {
      mapRef.current.setCenter(coordinates);
      markerRef.current.setLngLat(coordinates);
      popupRef.current.setHTML(popupHtml);
      return;
    }

    window.mapboxgl.accessToken = mapToken;
    const map = new window.mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      zoom: 10,
    });

    mapRef.current = map;
    map.addControl(new window.mapboxgl.NavigationControl(), "bottom-right");

    const popup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);
    const marker = new window.mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;
    popupRef.current = popup;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      popupRef.current = null;
    };
  }, [
    campground?.geometry?.coordinates,
    campground?.location,
    campground?.title,
    mapToken,
  ]);

  return <div id="map" ref={containerRef} />;
}
