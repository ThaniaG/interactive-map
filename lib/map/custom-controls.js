// Control personalizado para rotar el mapa (incrementar bearing)
class RotateControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    
    const button = document.createElement('button');
    button.innerHTML = '&#x21bb;';
    button.title = 'Rotar mapa (incrementar bearing)';
    button.addEventListener('click', () => {
      let currentBearing = map.getBearing();
      map.setBearing(currentBearing + 15);
    });
    
    this._container.appendChild(button);
    return this._container;
  }
  
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// Control personalizado para inclinar el mapa (ajustar pitch)
class TiltControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    
    const button = document.createElement('button');
    button.innerHTML = '&#8593;';
    button.title = 'Aumentar inclinación (pitch)';
    button.addEventListener('click', () => {
      let currentPitch = map.getPitch();

      if (currentPitch < 60) {
        map.setPitch(currentPitch + 10);
      }
    });
    
    this._container.appendChild(button);
    return this._container;
  }
  
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// Control para disminuir el pitch, si deseas permitir reducirlo también
class UntiltControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    
    const button = document.createElement('button');
    button.innerHTML = '&#8595;';
    button.title = 'Disminuir inclinación (pitch)';
    button.addEventListener('click', () => {
      let currentPitch = map.getPitch();

      if (currentPitch > 0) {
        map.setPitch(currentPitch - 10);
      }
    });
    
    this._container.appendChild(button);
    return this._container;
  }
  
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

window.RotateControl = RotateControl;
window.TiltControl = TiltControl;
window.UntiltControl = UntiltControl;
