// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

export const parcelService = {
  getParcelByGeometry: async (wkt) => {
    const response = await fetch(`${API_BASE_URL}/parcels/geometry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wkt,
        bufferDistance: 50,
        bufferUnit: 'm'
      })
    });
    return response.json();
  },

  getParcelByAddress: async (address) => {
    const response = await fetch(`${API_BASE_URL}/parcels/address?text=${encodeURIComponent(address)}`);
    return response.json();
  },

  getStructures: async (parcelId) => {
    const response = await fetch(`${API_BASE_URL}/structures/parcel/${parcelId}`);
    return response.json();
  },

  getZoning: async (parcelId) => {
    const response = await fetch(`${API_BASE_URL}/zoning/parcel/${parcelId}`);
    return response.json();
  }
};