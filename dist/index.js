const getElement = (selected) => {
  const element = document.querySelector(selected);
  if (element) return element;
  throw new Error(
    `Please check "${selected}" selector, no such element exists`
  );
};

const API_URL = "https://api.shrtco.de/v2/";

const openMenu = () => {
  const menuLinks = getElement(".menu-links");
  const hamburger = getElement(".menu-btn_burger");
  menuLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
};

const displayAlertMessage = () => {
  const alertText = getElement(".alert_message");
  alertText.textContent = "Please add a link";
  alertText.classList.add("show");
  const input = getElement(".url-value");
  input.classList.add("alert");
};

const removeAlertMessage = () => {
  const alertText = getElement(".alert_message");
  alertText.textContent = "";
  alertText.classList.remove("show");
  const input = getElement(".url-value");
  input.classList.remove("alert");
};

const menuBtn = getElement(".menu-btn");
menuBtn.addEventListener("click", openMenu);

const form = getElement(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getUrlFromUser();
  reset();
});

const reset = () => (getElement(".url-value").value = "");

const getUrlFromUser = async () => {
  const url = getElement(".url-value").value;
  if (!url) {
    displayAlertMessage();
    return;
  } else {
    removeAlertMessage();
    let shortLink = await fetchData(url);
    addToLocalStorage(url, shortLink);
    renderLinks(url, shortLink);
  }
};

const fetchData = async (url) => {
  try {
    const result = await fetch(`${API_URL}shorten?url=${url}`);
    const response = await result.json();
    const shortLink = response.result.short_link;
    return shortLink;
  } catch (err) {
    console.log(err);
    throw new Error("There was an error fetching data");
  }
};

const addToLocalStorage = (longUrl, shortUrl) => {
  const links = { longUrl, shortUrl };
  if (!longUrl) {
    return;
  } else {
    let data = getLocalStorage();
    data.push(links);
    localStorage.setItem("links", JSON.stringify(data));
  }
};

const getLocalStorage = () => {
  return localStorage.getItem("links")
    ? JSON.parse(localStorage.getItem("links"))
    : [];
};

const setUpLinks = () => {
  let links = getLocalStorage();
  links.map((link) => {
    const { longUrl, shortUrl } = link;
    renderLinks(longUrl, shortUrl);
  });
};

window.addEventListener("DOMContentLoaded", setUpLinks);

const renderLinks = (longLink, shortLink) => {
  const links = getElement(".links");
  const element = document.createElement("div");
  element.setAttribute("class", "links-container");
  const template = `<p class="original-link">${longLink}</p>
            <div class="short_link-copy_btn">
              <p class="shortened-link">https://${shortLink}</p>
              <button class="copy-link">Copy</button>
            </div>`;
  element.innerHTML = template;
  links.appendChild(element);
  const copyButton = element.querySelector(".copy-link");
  const shortUrl = element.querySelector(".shortened-link");
  copyShortLink(copyButton, shortUrl);
};

const copyShortLink = (copyButton, shortLink) => {
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(shortLink.textContent);
    copyButton.textContent = "Copied!";
    copyButton.style.backgroundColor = "hsl(257, 27%, 26%)";
    resetCopyBtn(copyButton);
  });
};

const resetCopyBtn = (button) => {
  setTimeout(() => {
    button.textContent = "Copy";
    button.style.backgroundColor = "hsl(180, 66%, 49%)";
  }, 1000);
};
