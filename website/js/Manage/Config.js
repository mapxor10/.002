function saveConfigSettings(userID, bot, e, card) {
    let colddownCheck = colddowns.filter(d => d.name == "saveConfigSettings" && d.bot == bot && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let prefix = document.querySelector('#bot_prefix').value
    let owner = document.querySelector('#bot_owner').value
    let language = document.querySelector('#bot_language').value
    if (!prefix || prefix == '') {
        return createAlert('error', 'Error', 'Prefix field required.')
    }
    if (prefix.startsWith('/')) {
        return createAlert('error', 'Error', 'You cant use / as prefix.')
    }
    if (!owner || owner == '') {
        return createAlert('error', 'Error', 'Owner field required.')
    }


    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/manage/config', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
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
        action: 'config',
        userId: userID,
        bot: bot,
        prefix: prefix,
        owner: owner,
        language: language,
    });
    
    requestLimit(3000, 'saveConfigSettings', bot)
xhr.send(data);
    card.style.display = 'none'
}
