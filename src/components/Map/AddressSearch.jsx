import { useState } from 'react'
import { StandaloneSearchBox } from '@react-google-maps/api'

function AddressSearch({ onPlaceSelected }) {
  const [searchBox, setSearchBox] = useState(null)

  const onLoad = (ref) => {
    setSearchBox(ref)
  }

  const onPlacesChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlaces()[0]
      if (place) {
        onPlaceSelected({
          address: place.formatted_address,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        })
      }
    }
  }

  return (
    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
      <input
        type="text"
        placeholder="Enter an address..."
        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
      />
    </StandaloneSearchBox>
  )
}

export default AddressSearch