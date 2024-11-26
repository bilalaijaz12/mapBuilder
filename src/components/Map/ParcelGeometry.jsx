import * as THREE from 'three';
import { wktToGeometry, latLngToWorld } from '../../utils/geometry';
import { PARCEL_COLORS, MATERIALS } from '../../constants/colors';

class ParcelGeometry {
  constructor(parcel, transformer) {
    this.parcel = parcel;
    this.transformer = transformer;
    this.mesh = null;
    this.outline = null;
  }

  createGeometry() {
    if (!this.parcel?.location?.geometry?.wkt) return null;

    const coordinates = wktToGeometry(this.parcel.location.geometry.wkt);
    if (!coordinates || coordinates.length < 3) return null;

    const shape = new THREE.Shape();
    coordinates.forEach((coord, index) => {
      const point = latLngToWorld(coord.lat, coord.lng, this.transformer);
      if (index === 0) {
        shape.moveTo(point.x, point.y);
      } else {
        shape.lineTo(point.x, point.y);
      }
    });

    return shape;
  }

  create() {
    const shape = this.createGeometry();
    if (!shape) return null;

    const geometry = new THREE.ShapeGeometry(shape);
    
    // Choose material based on empty/occupied status
    this.mesh = new THREE.Mesh(
      geometry,
      this.parcel.isEmpty ? MATERIALS.EMPTY : MATERIALS.OCCUPIED
    );
    
    // Set height slightly above ground
    this.mesh.position.z = 1;

    // Create outline
    const outlineGeometry = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: this.parcel.isEmpty ? 
        PARCEL_COLORS.EMPTY.outline : 
        PARCEL_COLORS.OCCUPIED.outline,
      linewidth: 2
    });
    
    this.outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
    this.outline.position.z = 1.1; // Slightly above fill

    return {
      mesh: this.mesh,
      outline: this.outline
    };
  }

  update(isSelected) {
    if (!this.mesh || !this.outline) return;

    // Update materials based on selection state and empty status
    const material = isSelected ? MATERIALS.SELECTED : 
      (this.parcel.isEmpty ? MATERIALS.EMPTY : MATERIALS.OCCUPIED);
    
    const outlineColor = isSelected ? PARCEL_COLORS.SELECTED.outline :
      (this.parcel.isEmpty ? PARCEL_COLORS.EMPTY.outline : PARCEL_COLORS.OCCUPIED.outline);

    this.mesh.material = material;
    this.outline.material.color.set(outlineColor);
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    if (this.outline) {
      this.outline.geometry.dispose();
      this.outline.material.dispose();
    }
  }
}

export default ParcelGeometry;