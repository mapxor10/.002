function manageBotmakerSubscriptionConfig(user, bot, e, p) {
    let inputs = e.querySelector('.inputs')
    let server = inputs.querySelector('#subscription_server').value || null
    let log = inputs.querySelector('#log_channel_id').value || null
    let role = inputs.querySelector('#custmer_role_id').value || null
    let bank = inputs.querySelector('#bank_account_id').value || null
    let probot = inputs.querySelector('#probot_id').value || null
    let balance = inputs.querySelector('#bot_balance_add_amount').value || null

    if (balance <= 0) balance = null

    p.style.display = 'none'

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/manage/subscription', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message, res.data.alert.width)
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
        Type: 'Config',
        userId: userID,
        by: userID,
        id: botID,
        server: server,
        log: log,
        role: role,
        bank: bank,
        probot: probot,
        balance: balance,
    });
xhr.send(data);
}

function subscriptionBotPriceManageForm(button, p) {
    let subscription = button.dataset.subscription
    let guild = button.dataset.guild
    let bot = button.dataset.bot


    let price = p.querySelector("#bot_price").value
    if (!subscription || !guild) {
        return createAlert('error', 'Error', 'Reload the page and retry.!')
    }
    if (price <= 0) {
        return createAlert('error', 'Error', 'You cant put the price to 0 or -0!')
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/manage/subscription', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message, res.data.alert.width)
                }
                if (res?.data?.window?.reload?.status == true && res?.data?.window?.reload?.timeout && !isNaN(res?.data?.window?.reload?.timeout)) {
                    setTimeout(() => {
                        window.location.reload();
                    }, res.data.window.reload.timeout)
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        Type: 'Manage',
        action: "bot_price",
        userId: userID,
        by: userID,
        id: botID,
        server: guild,
        price: price,
        bot: bot,
        subscription: subscription
    });
xhr.send(data);
}