var protectionConfigSettingsForm = document.getElementById("protection_config_settings_form")
function protectionActionLimit(action, event) {
    event.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "protectionActionLimit" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }

    let actionToManage = action.id
    let limit = action.querySelector("#protection_action_limit_inp").value
    let automode = action.querySelector("#protection_action_automode_selector").value

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/protection', true);
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
        type: 'limit',
        action: 'manage',
        id: botID,
        server: serverID,
        by: userID,
        actionToManage: actionToManage,
        actionLimit:limit,
        actionAutomode: automode
    });

    requestLimit(3000, 'protectionActionLimit', botID)
xhr.send(data);
}
function protectionAddUserToAction(action, event) {
    event.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "protectionAddUserToAction" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let user = action.querySelector("#protection_user_id_to_add").value || null
    let actionToAdd = action.id
    if (!user || user == "") {
        return createAlert("error", "Error", "User id field is required")
    }
    if (isNaN(user)) {
        return createAlert("error", "Error", "Put valid user id")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/protection', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                action.querySelector("#protection_user_id_to_add").value = ""
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
        type: 'whitelist',
        action: 'add',
        id: botID,
        server: serverID,
        by: userID,
        actionToAdd: actionToAdd,
        userToAdd: user,
    });

    requestLimit(3000, 'protectionAddUserToAction', botID)
xhr.send(data);
}
function protectionRemoveUserFromAction(d, sub) {
    let colddownCheck = colddowns.filter(d => d.name == "protectionRemoveUserFromAction" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let user = d.dataset.userID
    let actionToRemove = d.dataset.action

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/protection', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);

                let ProtectionData = res.data?.protectionData || null

                sub.innerHTML = ``;
                if (ProtectionData) {
                    ProtectionData?.forEach((user) => {
                        sub.innerHTML += `
                        <div class="user-card">
                        <h5>${user}</h5>
                        <button class="protection_delete_user_action_btn" data-userID="${user}" data-action="${actionToRemove}" onclick="protectionRemoveUserFromAction(this, this.parentElement.parentElement)">Delete</button>
                    </div>`;
                    })
                }


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
        type: 'whitelist',
        action: 'remove',
        id: botID,
        server: serverID,
        by: userID,
        actionToRemove: actionToRemove,
        userToRemove: user,
    });

    requestLimit(3000, 'protectionRemoveUserFromAction', botID)
xhr.send(data);
}
protectionConfigSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "protectionConfigSettingsForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let logChannel = protection_log_channel_selector.value
    if (isNaN(logChannel)) {
        return createAlert("error", "Error", "Select the log channel to save it")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/protection', true);
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
        type: 'config',
        action: 'manage',
        id: botID,
        server: serverID,
        by: userID,
        channel: logChannel,
    });

    requestLimit(10000, 'protectionConfigSettingsForm', botID)
xhr.send(data);
})

function protectionAntiBotSystem(mode) {
    let colddownCheck = colddowns.filter(d => d.name == "protectionAntiBotSystem" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/protection', true);
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
        type: 'config',
        action: 'manage',
        id: botID,
        server: serverID,
        by: userID,
        mode: mode,
    });

    requestLimit(5000, 'protectionAntiBotSystem', botID)
xhr.send(data);
}