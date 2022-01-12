const body = document.querySelector("body");

const Menu = {
  open() {
    document.querySelector(".mobile-menu").classList.add("active");
    body.style.overflowY = "hidden";
  },
  close() {
    document.querySelector(".mobile-menu").classList.remove("active");
    body.style.overflowY = "inherit";
  },
};
