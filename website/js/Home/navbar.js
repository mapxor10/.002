function nav_bar_menu(e, p) {
  let arrow1 = e.querySelector(".arrows .arrorw_menu_hide")
  let arrow2 = e.querySelector(".arrows .arrorw_menu_show")
  let menu = p.querySelector(".submenu")
  arrow1.classList.toggle("hide")
  arrow2.classList.toggle("hide")
  menu.classList.toggle("hide")
}

async function AvatarShowTog(ele) {
  let menu = ele.querySelector(".menu")
  menu.classList.toggle("show")
}

// Mobile
async function MobileNavToggle(e, p) {
  let menu = p.querySelector(".menu")
  let x = p.querySelector(".close")
  let navMenu = document.getElementById("nav__links")
  menu.classList.toggle("hide")
  x.classList.toggle("hide")
  navMenu.classList.toggle("navBarHide")
}