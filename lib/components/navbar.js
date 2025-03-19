function activateElement(element) {
  const currentActiveElement = document.querySelector(".navbar-item.active");
  if (currentActiveElement) currentActiveElement.classList.remove("active");
  element.classList.add("active");
}

function hideConfigCard() {
  const filterMenuElements = document.querySelectorAll('.menu-filter');
  filterMenuElements.forEach((element) => {
    element.style.display = 'none';
  });
}

function showConfigCard() {
  const filterMenuElements = document.querySelectorAll('.menu-filter');
  filterMenuElements.forEach((element) => {
    element.style.display = 'inherit';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarItems = document.querySelectorAll('.navbar-item');

  toggleButton.addEventListener('click', function() {
    navbarMenu.classList.toggle('active');
  });
  
  navbarItems.forEach((navItem) => {
    navItem.addEventListener("click", (event) => {
      const element = event.currentTarget;
      const viewId = element.getAttribute('id');
      activateElement(element);

      if (window.map?.getLayer?.('3d-bars') && viewId === '3d') {
        window.hide2DMap();
        window.show3DMap();
        showConfigCard();
      } else if (window.map?.getLayer?.('2d-bars') && viewId === '2d') {
        window.hide3DMap();
        window.show2DMap();
        hideConfigCard();
      }
    });

    if (!navItem.classList.contains("active")) {
      activateElement(navItem);
    }
  });

  const initialActive = document.querySelector('.navbar-item.active');
  if (initialActive) {
    activateElement(document.querySelector('.navbar-item'));
  }
});
