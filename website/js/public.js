let alertsCount = 0
function createAlert(type, title, text) {
  if(alertsCount > 3) return
  let alertNotifications = document.getElementById('alert');
  let newToast = document.createElement('div');
  let icon;
  if (type == "success") icon = "fa-solid fa-square-check"
  if (type == "error") icon = "fa-solid fa-square-xmark"
  if (type == "warning") icon = "fa-solid fa-circle-exclamation"
  if (type == "info") icon = "fa-solid fa-exclamation"
  ++alertsCount
  alertNotifications.style.display = "flex"
  newToast.innerHTML = `
    <div class="alert-content">

    <div class="icon">
        <i class="${icon} ${type}"></i>
    </div>
    <div class="text">
        <h3 class="${type}">${title}</h3>
        <p>${text}</p>
    </div>
    <div class="close">
        <i class="fa-solid fa-xmark" onclick="(this.parentElement.parentElement).remove()"></i>
    </div>

</div>`;
  alertNotifications.appendChild(newToast);
  setTimeout(() => {
    --alertsCount
    if (alertsCount <= 0) {
      alertNotifications.style.display = "none"
    }
    newToast.remove()
  }, 5000)
}

function createAlertCard(title, order_title, text, inputs, buttons) {
  let alertCard = document.getElementById('alert_card');
  alertCard.style.display = "flex"
  alertCard.innerHTML = `
  <div class="card__content">
  <h4 class="title">${title}</h4>
  <h3 class="order_title">${order_title}</h3>
  <h3 class="description">${text}</h3>
  <div class="inputs">
  ${inputs}
    </div>
  <div class="buttons">
      <button class="cancel" onclick="(this.parentElement.parentElement.parentElement).style.display = 'none'">Cancel</button>
      ${buttons}
      </div>
      </div>
      `;
}

// createAlertCard("test", "Order", "hello", ``, `<button class="save">Save</button>`)
document.addEventListener("DOMContentLoaded", function () {
  localStorage.setItem(`Language`, weblanguage)
});

var websiteLanguage = localStorage.Language || "EN"
var elements = document.querySelectorAll('[class]');
async function languageChanger(language) {
  let currentLanguageChanger = localStorage.Language || "EN"
  if (currentLanguageChanger == language) return
  websiteLanguage = language
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/language', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
      } else {
        console.error('error');
      }
    }
  };

  var data = JSON.stringify({
    language: language,
    user: userID || null,
  });

  requestLimit(3000, 'Add_Remove_AutolineChannel', botID)
xhr.send(data);
  await location.reload()
}