const getElement = (selected) => {
  const element = document.querySelector(selected);
  if (element) return element;
  throw new Error(
    `Please check "${selected}" selector, no such element exists`
  );
};

// Please add a link

const openMenu = () => {
  const menuLinks = getElement(".menu-links");
  const hamburger = getElement(".menu-btn_burger");
  menuLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
};

const menuBtn = getElement(".menu-btn");
menuBtn.addEventListener("click", openMenu);
