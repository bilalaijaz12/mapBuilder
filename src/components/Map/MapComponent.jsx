import { useState, useCallback } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { parcelService } from '../../services/api'
import AddressSearch from './AddressSearch'
import GLOverlay from './GLOverlay'
import calculateBuildableArea from '../../utils/buildableArea'

const libraries = ['places']

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0
}

const defaultCenter = {
  lat: 30.267153,
  lng: -97.743057  // Default to Austin, TX
}

function MapComponent() {
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(defaultCenter)
  const [zoom, setZoom] = useState(19)  // Increased default zoom
  const [heading, setHeading] = useState(0)
  const [tilt, setTilt] = useState(75)  // Start with more dramatic tilt
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [noParcelFound, setNoParcelFound] = useState(false)

  const defaultOptions = {
    mapId: 'Vector Map ID',
    tilt: 75,
    heading: 0,
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    zoomControl: false,
    rotateControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    disableDefaultUI: false,
    building: true,
    maxZoom: 21,
    minZoom: 15
  }

  const onLoad = useCallback((map) => {
    // Set additional options that require google.maps
    map.setOptions({
      rotateControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180
        },
        strictBounds: true
      }
    });
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handlePlaceSelected = useCallback((place) => {
    if (place.location) {
      setCenter(place.location)
      setZoom(19)  // Zoom in more when selecting a place
    }
  }, [])

  const handleMapClick = async (event) => {
    try {
      setLoading(true);
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const wkt = `POINT(${lng} ${lat})`;

      const geocoder = new google.maps.Geocoder();
      
      const clickedLocation = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK') {
            console.log('Clicked Address:', results[0].formatted_address);
            resolve(results[0]);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      const parcelData = await parcelService.getParcelByGeometry(wkt);
      console.log('Parcel Data:', parcelData);
      
      if (parcelData.parcels && parcelData.parcels.length > 0) {
        const clickedStreetNumber = clickedLocation.address_components.find(
          c => c.types.includes('street_number')
        )?.long_name;

        const matchingParcel = parcelData.parcels.find(parcel => 
          parcel.location.streetAddress.includes(clickedStreetNumber)
        );

        if (matchingParcel) {
          const parcelId = matchingParcel.id;
          const structuresData = await parcelService.getStructures(parcelId);
          console.log('Structures Data:', structuresData);
          console.log('Matching Parcel:', matchingParcel);
          
          if (!structuresData.structures || structuresData.structures.length === 0) {
            const zoningData = await parcelService.getZoning(parcelId);
            console.log('Zoning Data:', zoningData);
            
            const completeParcelData = {
              ...matchingParcel,
              zoning: zoningData.zonings[0],
              isEmpty: true
            };

            const buildableArea = calculateBuildableArea(completeParcelData);
            
            setSelectedParcel({
              ...completeParcelData,
              buildableArea
            });
          } else {
            setSelectedParcel({
              ...matchingParcel,
              isEmpty: false
            });
          }
        } else {
          console.log('No exact matching parcel found for clicked address');
          setSelectedParcel(null);
          setNoParcelFound(true);
        }
      }
    } catch (error) {
      console.error('Error processing click:', error);
      setSelectedParcel(null);
    } finally {
      setLoading(false);
    }
  };

  const rotateLeft = () => {
    if (map) {
      const currentHeading = map.getHeading() || 0
      map.setHeading(currentHeading - 45)
      setHeading(currentHeading - 45)
    }
  }

  const rotateRight = () => {
    if (map) {
      const currentHeading = map.getHeading() || 0
      map.setHeading(currentHeading + 45)
      setHeading(currentHeading + 45)
    }
  }

  const adjustTilt = () => {
    if (map) {
      const newTilt = tilt === 0 ? 75 : 0  // Toggle between flat and steep angle
      map.setTilt(newTilt)
      setTilt(newTilt)
    }
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="h-screen">
        <div className="absolute top-4 w-full px-4 z-10">
          <AddressSearch onPlaceSelected={handlePlaceSelected} />
        </div>
        <div className="h-full">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={defaultOptions}
            onClick={handleMapClick}
          >
            {map && <GLOverlay 
              map={map} 
              selectedParcel={selectedParcel}
            />}
          </GoogleMap>
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white p-4 rounded-lg shadow">
                Loading...
              </div>
            </div>
          )}
 
          {/* Selected Parcel Info */}
          {selectedParcel && (
            <div className="absolute top-20 left-4 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold">
                  {selectedParcel.isEmpty ? 'Empty Plot Analysis' : 'Occupied Plot'}
                </h3>
                <button 
                  onClick={() => setSelectedParcel(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {selectedParcel.isEmpty && selectedParcel.buildableArea && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p>{selectedParcel.location.streetAddress}</p>
                    <p>{selectedParcel.location.locality}, {selectedParcel.location.regionCode} {selectedParcel.location.postalCode}</p>
                  </div>
 
                  <div>
                    <h4 className="font-semibold">Lot Size</h4>
                    <p>{selectedParcel.buildableArea.lotSize.toFixed(2)} sq ft</p>
                  </div>
 
                  <div>
                    <h4 className="font-semibold">Required Setbacks (ft)</h4>
                    <p>Front: {selectedParcel.buildableArea.setbacks.front}</p>
                    <p>Rear: {selectedParcel.buildableArea.setbacks.rear}</p>
                    <p>Side: {selectedParcel.buildableArea.setbacks.side}</p>
                  </div>
 
                  <div>
                    <h4 className="font-semibold">Building Potential</h4>
                    <p>Maximum Height: {selectedParcel.buildableArea.maxHeight} ft</p>
                    <p>Floor Area Ratio (FAR): {selectedParcel.buildableArea.far}</p>
                    <p>Maximum Buildable Area: {selectedParcel.buildableArea.maxBuildableArea.toFixed(2)} sq ft</p>
                  </div>
 
                  {/* Optional: Show raw descriptions for verification */}
                  <div className="mt-4 text-xs text-gray-500">
                    <button 
                      onClick={() => setShowRawData(!showRawData)} 
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {showRawData ? 'Hide' : 'Show'} Original Zoning Descriptions
                    </button>
                    {showRawData && (
                      <div className="mt-2 space-y-2">
                        <p><strong>Front Setback:</strong> {selectedParcel.buildableArea.descriptions.frontSetback}</p>
                        <p><strong>Rear Setback:</strong> {selectedParcel.buildableArea.descriptions.rearSetback}</p>
                        <p><strong>Side Setback:</strong> {selectedParcel.buildableArea.descriptions.sideSetback}</p>
                        <p><strong>Height:</strong> {selectedParcel.buildableArea.descriptions.height}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
 
              {!selectedParcel.isEmpty && (
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Address</h4>
                    <p>{selectedParcel.location.streetAddress}</p>
                    <p>{selectedParcel.location.locality}, {selectedParcel.location.regionCode} {selectedParcel.location.postalCode}</p>
                  </div>
                  <p>This plot is currently occupied and not available for development.</p>
                </div>
              )}
            </div>
          )}
 
          {/* No Parcel Found Popup */}
          {noParcelFound && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">No Parcel Data Found</h3>
                <p className="text-gray-600">We couldn't find parcel data for the selected location.</p>
                <button 
                  onClick={() => setNoParcelFound(false)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
 
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            {/* Zoom Controls */}
            <button 
              onClick={() => map?.setZoom((map.getZoom() || 19) + 1)}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Zoom In"
            >
              +
            </button>
            <button 
              onClick={() => map?.setZoom((map.getZoom() || 19) - 1)}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Zoom Out"
            >
              −
            </button>
 
            <button 
              onClick={rotateLeft}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Rotate Left"
            >
              ↶
            </button>
            <button 
              onClick={rotateRight}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Rotate Right"
            >
              ↷
            </button>
            <button 
              onClick={adjustTilt}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Toggle Tilt"
            >
              {tilt === 0 ? '⊥' : '∠'}
            </button>
          </div>
        </div>
      </div>
    </LoadScript>
  )
 }
 
 export default MapComponent
