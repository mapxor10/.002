function renewFuncation(button) {
  let price = +button.dataset.price
  let bot = button.dataset.bot
  let name = button.dataset.name
  createAlertCard('تجديد', 'تجديد اشتراك بوت', `<span id='renew_price_content'>${price} عملات</span>`, "<input class='comp-range1' type='range' name='' id='renew_input' maxlength='6' value='1' step='1' min='1' max='6'> <span class='c-w range_value' id='renew_months_content'>1 شهور</span>", `<button data-bot='${bot}' data-name='${name}' class='save' onclick='buyRenewFunction(this , this.dataset.bot, this.dataset.name, this.parentElement.parentElement, this.parentElement.parentElement.parentElement)'>Renew</button>`)
  let rangeInput = document.getElementById("renew_input")
  rangeInput.addEventListener('input', () => {
    let priceContent = document.getElementById("renew_price_content")
    let monthsContent = document.getElementById("renew_months_content")
    priceContent.textContent = `${price * rangeInput.value} عملات`
    monthsContent.textContent = `${rangeInput.value} شهور`
  })

}
function buyRenewFunction(button, bot, name, e, card) {
  let colddownCheck = colddowns.filter(d => d.name == "buyRenewFunction" && d.bot == bot && d.user == userID)[0]
  if (colddownCheck) {
      return createAlert('warning', 'Warn', 'You do that too fast.!')
  }
  let price = parseInt(e.querySelector('.card__content .description #renew_price_content').textContent)
  let months = +e.querySelector('.card__content .inputs #renew_input').value
  let botID = bot
  button.disabled = true
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/bot/manage/renew', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        card.style.display = `none`
        let res = JSON.parse(xhr.response);
        if (res.data?.alert?.active == true) {
          createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message)
        }
        if (res?.data?.page?.url && res?.data?.page?.url != "") {
          handlePageNavigation1(res.data.page.url)
        }
      } else {
        console.error('error');
      }
    }
  };

  var data = JSON.stringify({
    userId: userID,
    bot: botID,
    name: name,
    months: months,
    price: price
  });

  requestLimit(3000, 'buyRenewFunction', bot)
xhr.send(data);
}

var cards = document.getElementById("botscards");
var pageNumber = 1
var maxPages;
function pageDispaly(pageNumber, search) {
  document?.querySelectorAll(".card#alt_cards")?.forEach(a => a.remove())
  cards?.querySelectorAll(".card")?.forEach((card, i) => {
      card.classList.add('hide')
      var currentPage = Math.ceil((i + 1) / 10);
      maxPages = currentPage
      if (search && search != "" && !search.includes("node-")) {
          if (card.dataset.type.includes(search) || card.dataset.id.includes(search) || card.dataset.owner.includes(search) || card.dataset.name.includes(search)) {
              card.classList.remove('hide')
          }
      }
      if (search && search.includes("node-")) {
          if (card.dataset.node == search.replace("node-", '')) {
              card.classList.remove('hide')
          }
      }
      else if (currentPage == pageNumber) {
          card.classList.remove('hide')
      }

  });
}

pageDispaly(pageNumber)

function search(inp, event) {
  var value = inp.value;
  if (event.keyCode == 13) {
      pageDispaly(null, value)
  }
}
function pageChanger(action) {
  var pageNumberHolder = document.getElementById("pagination_number");
  if (action == "prev") {
    if (pageNumber <= 1) return;
    pageNumber = pageNumber - 1;
    pageDispaly(pageNumber);
  } else {
    if (pageNumber >= maxPages) return;
    pageNumber = pageNumber + 1;
    pageDispaly(pageNumber);
  }
  pageNumberHolder.innerHTML = `${pageNumber}`;
}