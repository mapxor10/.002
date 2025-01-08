async function languageToggleMenu(ele) {
  console.log(ele)
  let menu = ele.querySelector(".menu")
  menu.classList.toggle("show")
}
function sideBarToggle() {
  let sidebar = document.getElementById("side__bar")
  let navbar = document.getElementById("nav__bar")
  let container = document.getElementById("main__content")
  let sidebarDisplay = window.getComputedStyle(sidebar).getPropertyValue("display")
  if (sidebarDisplay == "none") {
    container.style.minHeight = `calc(100vh - 50px);`;
    sidebar.style.display = `flex`;
    navbar.style.width = `calc(100vw - 250px)`;
  } else {
    container.style.minHeight = `100vh`;
    sidebar.style.display = `none`;
    navbar.style.width = `100vw`;
  }
}