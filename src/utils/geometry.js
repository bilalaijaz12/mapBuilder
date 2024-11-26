// Convert WKT string to Three.js coordinates
export const wktToGeometry = (wkt) => {
    if (!wkt) return null;
    
    // Remove POLYGON and extra parentheses, split into coordinates
    const coordsString = wkt
      .replace('POLYGON ((', '')
      .replace('))', '')
      .split(',');
  
    // Convert string coordinates to number pairs
    return coordsString.map(coord => {
      const [lng, lat] = coord.trim().split(' ').map(Number);
      return { lng, lat };
    });
  };
  
  // Convert lat/lng to world coordinates
  export const latLngToWorld = (lat, lng, transformer) => {
    const point = transformer.fromLatLngAltitude({
      lat,
      lng,
      altitude: 0
    });
    
    return {
      x: point[0],
      y: point[1],
      z: point[2]
    };
  };