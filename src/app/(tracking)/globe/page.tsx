"use client"

import "./globe.css"
import { useEffect, useRef, useState, useCallback } from "react"
import type { Map as MaplibreMap } from "maplibre-gl"

const TILE_LIGHT = "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
const TILE_DARK = "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"

function getPageTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getTileUrl(theme: "auto" | "light" | "dark"): string {
  const effective = theme === "auto" ? getPageTheme() : theme
  return effective === "dark" ? TILE_DARK : TILE_LIGHT
}

interface Location {
  id: number;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  visitDate: string;
  duration: string;
  highlights: string[];
  rating: number;
}

export default function GlobePage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MaplibreMap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [isGlobe, setIsGlobe] = useState(true)
  const [mapTheme, setMapTheme] = useState<"auto" | "light" | "dark">("auto")

  // Swap tile source on the live map
  const applyTiles = useCallback((tileUrl: string) => {
    if (!map.current) return
    try {
      if (map.current.getLayer("simple-tiles")) map.current.removeLayer("simple-tiles")
      if (map.current.getSource("raster-tiles")) map.current.removeSource("raster-tiles")
      map.current.addSource("raster-tiles", {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
      })
      map.current.addLayer({
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      })
    } catch (e) {
      console.error("Error swapping tiles:", e)
    }
  }, [])

  // Watch page theme changes for auto mode
  useEffect(() => {
    if (mapTheme !== "auto") return
    const observer = new MutationObserver(() => {
      applyTiles(getTileUrl("auto"))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    applyTiles(getTileUrl("auto"))
    return () => observer.disconnect()
  }, [mapTheme, applyTiles])

  // Apply tiles when mapTheme changes (non-auto)
  useEffect(() => {
    if (mapTheme === "auto" || !map.current) return
    applyTiles(getTileUrl(mapTheme))
  }, [mapTheme, applyTiles])

  // Fetch locations from API
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/data?type=locations");
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load location data");
      }
    }
    fetchLocations();
  }, []);

  const toggleProjection = useCallback(() => {
    if (!map.current) return
    const next = !isGlobe
    setIsGlobe(next)
    map.current.setProjection({ type: next ? "globe" : "mercator" })
  }, [isGlobe])

  useEffect(() => {
    if (map.current || locations.length === 0) return

    const initMap = async () => {
      try {
        const ml = await import("maplibre-gl")

        if (!document.querySelector('link[href*="maplibre-gl"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css'
          document.head.appendChild(link)
        }

        map.current = new ml.Map({
          container: mapContainer.current!,
          style: {
            version: 8,
            projection: { type: "globe" },
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [getTileUrl("auto")],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
              },
            },
            layers: [
              {
                id: "simple-tiles",
                type: "raster",
                source: "raster-tiles",
                minzoom: 0,
                maxzoom: 22,
              },
            ],
          },
          center: [-95, 40],
          zoom: 2,
          maplibreLogo: false,
        })

        map.current.on("load", () => {
          if (!map.current) return

          locations.forEach((place) => {
            const el = document.createElement("div")
            el.className = `h-4 w-4 cursor-pointer rounded-xl border-2 pin-${place.type.toLowerCase()} bg-clip-content p-0.5`
            el.setAttribute("aria-label", `${place.name}, ${place.type}`)
            el.setAttribute("role", "button")

            const popupContent = `
              <div class="location-popup">
                <div class="location-popup-row">
                  <div class="location-popup-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="location-popup-name">${place.name}</div>
                  <div class="location-popup-type">${place.type}</div>
                </div>

                <div class="location-popup-row">
                  <div class="location-popup-stat">
                    <span class="location-popup-stat-label">Visited</span>
                    <span class="location-popup-stat-value">${place.visitDate || 'Unknown'}</span>
                  </div>
                  <div class="location-popup-stat">
                    <span class="location-popup-stat-label">Duration</span>
                    <span class="location-popup-stat-value">${place.duration || 'N/A'}</span>
                  </div>
                </div>

                <div class="location-popup-description">${place.description}</div>

                <div class="location-popup-row location-popup-actions">
                  <button class="location-popup-button" onclick="window.open('https://www.openstreetmap.org/search?query=${encodeURIComponent(place.name)}', '_blank')">
                    View on OSM
                  </button>
                  <button class="location-popup-button" onclick="window.open('https://www.mapillary.com/app/?lat=${place.coordinates[1]}&lng=${place.coordinates[0]}&z=17', '_blank')">
                    Street View
                  </button>
                </div>
              </div>
            `

            const marker = new ml.Marker({
              element: el,
              anchor: "bottom",
            })
              .setLngLat(place.coordinates as [number, number])
              .setPopup(
                new ml.Popup({
                  offset: 25,
                  closeButton: true,
                  maxWidth: '320px'
                }).setHTML(popupContent)
              )
              .addTo(map.current!)

            el.addEventListener("click", (e) => {
              e.stopPropagation()
              marker.togglePopup()
            })
          })

          map.current.dragRotate.enable()
          map.current.touchZoomRotate.enableRotation()
          map.current.scrollZoom.enable()
          map.current.doubleClickZoom.enable()
          map.current.resize()
          setLoading(false)
        })

        map.current.on("error", (e) => {
          console.error("MapLibre error:", e)
          setError("An error occurred while loading the map")
          setLoading(false)
        })
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to initialize the map")
        setLoading(false)
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [locations])

  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize()
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-lg">Loading map...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full bg-background" />

      {/* Hub card */}
      <div className="globe-hub">
        {/* Row 1: Name */}
        <div className="globe-hub-row">
          <div className="globe-hub-name">Kris Yotam</div>
        </div>

        {/* Row 2: Role */}
        <div className="globe-hub-row">
          <div className="globe-hub-role">Writer, Researcher, Reviewer</div>
        </div>

        {/* Row 3: Social */}
        <div className="globe-hub-row">
          <a
            href="https://x.com/krisyotam"
            target="_blank"
            rel="noopener noreferrer"
            className="globe-hub-social"
          >
            @krisyotam on X
          </a>
        </div>

        {/* Row 4: Places count */}
        <div className="globe-hub-row">
          <div className="globe-hub-count">
            {locations.length} {locations.length === 1 ? 'place' : 'places'} visited
          </div>
        </div>

        {/* Row 5: Globe / 2D toggle */}
        <div className="globe-hub-row">
          <button
            className={`globe-hub-toggle-btn${isGlobe ? ' active' : ''}`}
            onClick={() => { if (!isGlobe) toggleProjection() }}
          >
            Globe
          </button>
          <button
            className={`globe-hub-toggle-btn${!isGlobe ? ' active' : ''}`}
            onClick={() => { if (isGlobe) toggleProjection() }}
          >
            2D
          </button>
        </div>

        {/* Row 6: Theme toggle */}
        <div className="globe-hub-row">
          <button
            className={`globe-hub-toggle-btn${mapTheme === 'auto' ? ' active' : ''}`}
            onClick={() => setMapTheme('auto')}
          >
            Auto
          </button>
          <button
            className={`globe-hub-toggle-btn${mapTheme === 'light' ? ' active' : ''}`}
            onClick={() => setMapTheme('light')}
          >
            Light
          </button>
          <button
            className={`globe-hub-toggle-btn${mapTheme === 'dark' ? ' active' : ''}`}
            onClick={() => setMapTheme('dark')}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 dark:text-gray-500">
        &copy; OpenStreetMap &copy; CARTO
      </div>
    </div>
  )
}
