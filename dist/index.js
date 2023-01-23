const getElement = (selected) => {
  const element = document.querySelector(selected);
  if (element) return element;
  throw new Error(
    `Please check "${selected}" selector, no such element exists`
  );
};

const linksContainer = getElement(".links");
const alertText = getElement(".alert_message");
const input = getElement(".url-value");

const fadeIn = [
  { opacity: "0", scale: "0.95" },
  { opacity: "1", scale: "1" },
];

const fadeInTiming = {
  duration: 200,
  iterations: 1,
  fill: "forwards",
  easing: "ease-in-out",
};

const API_URL = "https://api.shrtco.de/v2/";

const openMenu = () => {
  const menuLinks = getElement(".menu-links");
  const hamburger = getElement(".menu-btn_burger");
  menuLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
};

const displayAlertMessage = () => {
  alertText.textContent = "Please add a link";
  alertText.classList.add("show");
  input.classList.add("alert");
};

const removeAlertMessage = () => {
  alertText.textContent = "";
  alertText.classList.remove("show");
  input.classList.remove("alert");
};

const menuBtn = getElement(".menu-btn");
menuBtn.addEventListener("click", openMenu);

const form = getElement(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  shortenURL();
});

const reset = () => (getElement(".url-value").value = "");

const shortenURL = () => {
  const url = getElement(".url-value").value;
  if (!url) {
    displayAlertMessage();
    return;
  } else {
    fetchData(url);
    removeAlertMessage();
  }
};

const fetchData = async (url) => {
  try {
    const result = await fetch(`${API_URL}shorten?url=${url}`);
    const response = await result.json();
    const shortLink = response.result.short_link;
    const id = new Date().getTime().toString();
    createLinkItem(url, shortLink, id);
    addToLocalStorage(url, shortLink, id);
    reset();
  } catch (err) {
    console.log(err);
    throw new Error("There was an error fetching data");
  }
};

const addToLocalStorage = (longUrl, shortUrl, id) => {
  const links = { longUrl, shortUrl, id };
  if (!longUrl) {
    return;
  } else {
    let data = getLocalStorage();
    data.push(links);
    localStorage.setItem("links", JSON.stringify(data));
  }
};

function getLocalStorage() {
  return localStorage.getItem("links")
    ? JSON.parse(localStorage.getItem("links"))
    : [];
}

function setUpLinks() {
  let links = getLocalStorage();
  links.map((link) => {
    const { longUrl, shortUrl, id } = link;
    createLinkItem(longUrl, shortUrl, id);
  });
}

window.addEventListener("DOMContentLoaded", setUpLinks);

function createLinkItem(longLink, shortLink, id) {
  const links = getElement(".links");

  const element = document.createElement("div");
  element.setAttribute("data-id", id);
  element.setAttribute("class", "links-container");
  const template = `<p class="original-link">${longLink}</p>
            <div class="short_link-copy_btn">
              <p class="shortened-link">https://${shortLink}</p>
              <div class="button_container">
                <button class="copy-link">Copy</button>
                <button class="delete_link"><i class='far fa-trash-alt'></i></button>
              </div>
            </div>`;
  element.innerHTML = template;
  links.appendChild(element);

  // copy the shortened link
  const copyButton = element.querySelector(".copy-link");
  const shortUrl = element.querySelector(".shortened-link");
  copyButton.addEventListener("click", (e) => {
    copyShortLink(e, shortUrl);
  });

  //animate element
  const container = getElement(".links-container");
  container.animate(fadeIn, fadeInTiming);

  // delete the link
  const deleteLinkBtn = element.querySelector(".delete_link");
  deleteLinkBtn.addEventListener("click", deleteLink);
}

function deleteLink(e) {
  const element = e.currentTarget.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  linksContainer.removeChild(element);
  removeFromLocalStorage(id);
}

function removeFromLocalStorage(id) {
  let links = getLocalStorage();
  links = links.filter((link) => link.id !== id);
  localStorage.setItem("links", JSON.stringify(links));
}

function copyShortLink(e, shortLink) {
  const button = e.target;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shortLink.textContent).then(() => {
      button.textContent = "Copied!";
      button.style.backgroundColor = "hsl(257, 27%, 26%)";

      setTimeout(() => {
        resetCopyBtn(button);
      }, 2000);
    });
  }
}

const resetCopyBtn = (button) => {
  button.textContent = "Copy";
  button.style.backgroundColor = "hsl(180, 66%, 49%)";
};
