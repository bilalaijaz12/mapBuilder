import * as THREE from 'three';

export const PARCEL_COLORS = {
  EMPTY: {
    fill: new THREE.Color(0x00ff00),  // Green
    outline: new THREE.Color(0x008800), // Darker green
    opacity: 0.3
  },
  OCCUPIED: {
    fill: new THREE.Color(0xff0000),  // Red
    outline: new THREE.Color(0x880000), // Darker red
    opacity: 0.3
  },
  SELECTED: {
    fill: new THREE.Color(0x0088ff),  // Blue
    outline: new THREE.Color(0x0044aa), // Darker blue
    opacity: 0.5
  }
};

export const MATERIALS = {
  EMPTY: new THREE.MeshBasicMaterial({
    color: PARCEL_COLORS.EMPTY.fill,
    transparent: true,
    opacity: PARCEL_COLORS.EMPTY.opacity,
    side: THREE.DoubleSide
  }),
  OCCUPIED: new THREE.MeshBasicMaterial({
    color: PARCEL_COLORS.OCCUPIED.fill,
    transparent: true,
    opacity: PARCEL_COLORS.OCCUPIED.opacity,
    side: THREE.DoubleSide
  }),
  SELECTED: new THREE.MeshBasicMaterial({
    color: PARCEL_COLORS.SELECTED.fill,
    transparent: true,
    opacity: PARCEL_COLORS.SELECTED.opacity,
    side: THREE.DoubleSide
  })
};