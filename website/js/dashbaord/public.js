function handlePageNavigation() {
  $(document).on("click", "a.dash-page", function (event) {
    event.preventDefault();
    let loader = document.getElementById("loader")
    loader.classList.remove("hide")
    let sidebar = document.getElementById("side__bar")
    var link = $(this).attr("href");
    try {
      $("#content-container").load(`${link}/load`, function (response, status, xhr) {
        if (status == "error") return location.reload();
        if (!event.target.classList.contains('update-link-not')) window.history.pushState({}, '', link)
        setTimeout(() => {
          loader.classList.add("hide")
        }, 600)
      });
    } catch (error) {
      location.reload();
    }

    sidebar.querySelectorAll(".gategory__title").forEach(g => g.classList.remove("active"))
    sidebar.querySelectorAll(".dash-page").forEach(g => g.classList.remove("active"))
    $(this).parent().parent().find(".gategory__title").addClass("active")
    $(this).addClass("active")
    $("#content-container").html("");
  });
}

$(document).ready(function () {
  handlePageNavigation();
});
var currentUrl = window.location.href;
function handlePageNavigation1(l, u) {
  let link = null;

  if (currentUrl.endsWith('dashboard')) link = "/dashboard"
  if (currentUrl.endsWith('order/bots')) link = "/order/bots"
  if (currentUrl.endsWith('manage/bots')) link = "/manage/bots"
  if (currentUrl.endsWith('manage/subscription')) link = "/manage/subscription"
  if (currentUrl.endsWith('tickets')) link = "/tickets"
  if (currentUrl.endsWith('logs')) link = "/logs"
  if (currentUrl.includes('manage/bot/')) link = `/manage/bot/${currentUrl.split("/")[5]?.trim()}`
  if (currentUrl.includes('control/bot/')) link = `/control/bot/${currentUrl.split("/")[5]?.trim()}/${currentUrl.split("/")[6]?.trim()}`
  if (currentUrl.includes('control/subscription/')) link = `/control/subscription/${currentUrl.split("/")[5]?.trim()}`
  if (l && l != "") link = l
  let loader = document.getElementById("loader")
  loader.classList.remove("hide")
  if (!u && u != 'link-update-no') window.history.pushState({}, '', link);

  $("#content-container").html("");
  $("#content-container").load(`${link}/load`, function (response, status, xhr) {
    if (status == "error") return location.reload();
    setTimeout(() => {
      loader.classList.add("hide")
    }, 600)
  });
}
handlePageNavigation1(null)
function sideBarSubmenuToggle(e, p) {
  let sidebar = document.getElementById("side__bar")
  sidebar.querySelectorAll('.gategory__title').forEach(g => {
    g.classList.remove("active")
  })
  e.classList.toggle("active")
  p.querySelector(".gategory__submenu").classList.toggle("hide")
}

window.addEventListener("load", () => {
  let loader = document.getElementById("loader")
  setTimeout(() => {
    loader.classList.add("hide")
  }, 600)
})



function handleControlPageChnager(l) {
  let link = l;
  $("#settings__content").html("");
  $("#settings__content").load(`${link}/load`, function (response, status, xhr) {
    if (status == "error") return location.reload();
  });
}
function handleControlPageChnager1() {
  $(document).on("click", "a.control-page", function (event) {
    event.preventDefault();
    document.querySelectorAll(`a.control-page`).forEach(c => {
      c.classList.remove('active')
    })
    event.target.classList.add('active')
    var link = $(this).attr("href");
    $("#settings__content").html("");
    $("#settings__content").load(`${link}/load`, function (response, status, xhr) {
      if (status == "error") return location.reload();
    });
  });
}