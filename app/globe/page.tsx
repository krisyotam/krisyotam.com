"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import locations from "@/data/locations.json"

// Environment variable with fallback
const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoia3Jpc3lvdGFtIiwiYSI6ImNtNWh5MmN2aDA5eGwybW9pNmsybHAwaWUifQ.kMV4TNmFY4pRB2-PIGFC9w"

declare global {
  interface Window {
    google: any
    openStreetView: (coordinates: number[], placeName: string) => void
  }
}

export default function GlobePage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize the Street View function on the window object
  useEffect(() => {
    window.openStreetView = (coordinates: number[], placeName: string) => {
      try {
        const panorama = new window.google.maps.StreetViewPanorama(document.createElement("div"), {
          position: { lat: coordinates[1], lng: coordinates[0] },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        })
        const streetViewWindow = window.open("", "_blank")
        if (streetViewWindow) {
          streetViewWindow.document.write(`
            <html>
              <head>
                <title>Street View - ${placeName}</title>
                <style>body { margin: 0; padding: 0; height: 100vh; }</style>
              </head>
              <body>
                <div id="street-view" style="width: 100%; height: 100%;"></div>
                <script src="https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"}&callback=initStreetView" async defer></script>
                <script>
                  function initStreetView() {
                    new google.maps.StreetViewPanorama(
                      document.getElementById('street-view'),
                      {
                        position: {lat: ${coordinates[1]}, lng: ${coordinates[0]}},
                        pov: {heading: 165, pitch: 0},
                        zoom: 1
                      }
                    );
                  }
                </script>
              </body>
            </html>
          `)
          streetViewWindow.document.close()
        }
      } catch (error) {
        console.error("Error opening Street View:", error)
        alert("Unable to open Street View. Google Maps API might not be loaded.")
      }
    }
  }, [])

  useEffect(() => {
    if (map.current) return // Map already initialized

    try {
      // Check if mapboxgl is available (important for SSR)
      if (!mapboxgl) {
        setError("Mapbox GL JS is not available")
        setLoading(false)
        return
      }

      // Set the access token
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
              tileSize: 256,
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
        zoom: 3,
        projection: "globe",
      })

      // Set up map on load
      map.current.on("load", () => {
        if (!map.current) return

        // Add atmosphere and fog effects
        map.current.setFog({
          color: "rgb(255, 255, 255)",
          "high-color": "rgb(255, 255, 255)",
          "horizon-blend": 0.02,
          "space-color": "rgb(255, 255, 255)",
          "star-intensity": 0
        })

        map.current.setLight({
          anchor: "map",
          color: "white",
          intensity: 0.4,
        })

        map.current.addLayer({
          id: "atmosphere",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
            "sky-atmosphere-color": "rgb(255, 255, 255)",
            "sky-atmosphere-halo-color": "rgb(255, 255, 255)"
          },
        })

        // Add location markers
        locations.forEach((place) => {
          const el = document.createElement("div")
          el.className = `h-4 w-4 cursor-pointer rounded-full border-2 pin-${place.type.toLowerCase()} bg-clip-content p-0.5 hover:scale-125 transition-transform duration-200`
          el.setAttribute("aria-label", `${place.name}, ${place.type}`)
          el.setAttribute("role", "button")

          // Create popup content with modern design
          const popupContent = `
            <div class="location-popup">
              <div class="location-popup-header">
                <div class="location-popup-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="location-popup-title">
                  <h3 class="location-popup-name">${place.name}</h3>
                  <p class="location-popup-type">${place.type}</p>
                </div>
              </div>
              
              <div class="location-popup-stats">
                <div class="location-popup-stat">
                  <p class="location-popup-stat-label">Visited</p>
                  <p class="location-popup-stat-value">${place.visitDate || 'Unknown'}</p>
                </div>
                <div class="location-popup-stat">
                  <p class="location-popup-stat-label">Duration</p>
                  <p class="location-popup-stat-value">${place.duration || 'N/A'}</p>
                </div>
              </div>

              <p class="location-popup-description">${place.description}</p>

              <div class="location-popup-actions">
                <button class="location-popup-button" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(place.name)}', '_blank')">
                  View on Maps
                </button>
                <button class="location-popup-button location-popup-button-primary" onclick="window.openStreetView([${place.coordinates[0]}, ${place.coordinates[1]}], '${place.name.replace(/'/g, "\\'")}')">
                  Street View
                </button>
              </div>
            </div>
          `

          // Add marker with popup
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: "center",
            rotationAlignment: "map",
            pitchAlignment: "map",
          })
            .setLngLat(place.coordinates as [number, number])
            .setPopup(
              new mapboxgl.Popup({ 
                offset: 25,
                closeButton: true,
                maxWidth: '320px'
              }).setHTML(popupContent)
            )
            .addTo(map.current!)

          // Add click handler
          el.addEventListener("click", (e) => {
            e.stopPropagation()
            marker.togglePopup()
          })
        })

        // Enable map controls
        map.current.dragRotate.enable()
        map.current.touchZoomRotate.enableRotation()
        map.current.scrollZoom.enable()
        map.current.doubleClickZoom.enable()

        // Ensure map is properly sized
        map.current.resize()

        // Update loading state
        setLoading(false)
      })

      // Handle map errors
      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setError("An error occurred while loading the map")
        setLoading(false)
      })
    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to initialize the map")
      setLoading(false)
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Globe</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">Places I've been to. Inspired by conquer.earth</p>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <div className="text-lg">Loading map...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 dark:text-gray-400">© Mapbox © OpenStreetMap</div>
    </div>
  )
}

