import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import ParcelGeometry from './ParcelGeometry'

function GLOverlay({ map, selectedParcel }) {
  const geometriesRef = useRef(new Map())

  useEffect(() => {
    if (!map) return

    const overlay = new google.maps.WebGLOverlayView()
    
    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    let renderer = null

    const clearScene = () => {
    while(scene.children.length > 0) { 
      const object = scene.children[0];
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
      scene.remove(object);
    }
    geometriesRef.current.clear();
  }

  overlay.onDraw = ({ gl, transformer }) => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    if (selectedParcel) {
      clearScene(); // Clear before adding new visualization
      updateParcelVisualization(transformer);
    }

    if (renderer) {
      renderer.render(scene, camera)
    }
  }

    // Function to clear all geometries
    const clearGeometries = () => {
      geometriesRef.current.forEach(geometry => {
        geometry.dispose()
      })
      geometriesRef.current.clear()
    }

    // Function to update parcel visualization
    const updateParcelVisualization = (transformer) => {
      if (selectedParcel) {
        let parcelGeometry = geometriesRef.current.get(selectedParcel.id)
        
        if (!parcelGeometry) {
          parcelGeometry = new ParcelGeometry(selectedParcel, transformer)
          const { mesh, outline } = parcelGeometry.create()
          
          if (mesh && outline) {
            scene.add(mesh)
            scene.add(outline)
            geometriesRef.current.set(selectedParcel.id, parcelGeometry)
          }
        }

        // Update all geometries (highlight selected, etc.)
        geometriesRef.current.forEach((geometry, id) => {
          geometry.update(id === selectedParcel.id)
        })
      }
    }

    overlay.onAdd = () => {
      // Set up any initial objects or state
    }

    overlay.onContextRestored = ({ gl }) => {
      renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        ...gl.getContextAttributes(),
      })
      renderer.autoClear = false

      // Add lighting
      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(0, -1, 1)
      scene.add(light)
      scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    }

    overlay.onDraw = ({ gl, transformer }) => {
      // Clear any existing render
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Update camera
      const matrix = transformer.fromLatLngAltitude({
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
        altitude: 120
      })
      
      camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)

      // Update parcel visualizations
      updateParcelVisualization(transformer)

      // Render
      if (renderer) {
        renderer.render(scene, camera)
      }
    }

    overlay.onRemove = () => {
      clearGeometries()
    }

    // Add the overlay to the map
    overlay.setMap(map)

    // Cleanup
    return () => {
      overlay.setMap(null)
    }
  }, [map, selectedParcel])

  return null
}

export default GLOverlay