function buildCheckboxList() {
  const towns = [];
  for (const province of window.provinces) {
    for (const town of province.towns) {
      towns.push({
        code: town.code,
        name: town.name
      });
    }
  }

  const townsContainer = document.getElementById('towns');  
  townsContainer.innerHTML = '';

  towns.forEach(({code, name}) => {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item');

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add("town-checkbox");
    checkbox.setAttribute("data-town", code);
    checkbox.checked = true;
    
    // para manejar el cambio de algun checkbox
    checkbox.addEventListener("change", function(e) {
      const allActiveCheckboxes = document.querySelectorAll('.town-checkbox');
      const activeCodes = Array.from(allActiveCheckboxes)
        .filter(c => c.checked)
        .map(c => c.getAttribute('data-town'));
      window.map.setFilter('3d-bars', ['in', ['get', 'code'], ['literal', activeCodes]]);
      window.map.setFilter('2d-bars', ['in', ['get', 'code'], ['literal', activeCodes]]);
    });
    
    // para manejar el hover
    cardItem.addEventListener("mouseenter", function() {
      window.map.setFilter('province-borders', ['in', ['get', 'code'], ['literal', [code]]]);
    });
    cardItem.addEventListener("mouseleave", function() {
      window.map.setFilter('province-borders', ['==', ['get', 'code'], 'none']);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + name));
    cardItem.appendChild(label);
    townsContainer.appendChild(cardItem);
  });
}

window.buildCheckboxList = buildCheckboxList;
