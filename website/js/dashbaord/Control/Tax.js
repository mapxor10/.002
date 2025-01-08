var TaxUploader = document.getElementById("line_uploader_input")
var percentage = document.getElementById("tax_custom_button_percentage")
var taxConfigForm = document.getElementById("tax_config_settings_form")

function Add_Remove_TaxChannel(channel) {
    let colddownCheck = colddowns.filter(d => d.name == "Add_Remove_TaxChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let channelID = channel.id
    let action = channel.dataset.action

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/tax', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (action == "add") {
                    channel.innerHTML = "Remove";
                    channel.dataset.action = 'remove'
                    channel.style.background = "#dc3545"
                } else {
                    channel.innerHTML = "Add";
                    channel.dataset.action = 'add'
                    channel.style.background = "#198754"
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
        type: 'channels',
        action: action,
        id: botID,
        server: serverID,
        channel: channelID,
        by: userID
    });

    requestLimit(3000, 'Add_Remove_TaxChannel', botID)
    xhr.send(data);

}
TaxUploader.onchange = function () {
    let line = document.getElementById("line__holder")
    let file = new FileReader();
    file.readAsDataURL(TaxUploader.files[0])
    file.onload = function (e) {
        line.src = file.result;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/bot/control/tax', true);
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
            type: 'line',
            action: 'set',
            id: botID,
            server: serverID,
            img: e.target.result,
            by: userID
        });

        xhr.send(data);

    }
}
function Delete_Tax_Line() {
    let colddownCheck = colddowns.filter(d => d.name == "Delete_Tax_Line" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let line = document.getElementById("line__holder")
    line.src = "";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/tax', true);
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
        type: 'line',
        action: 'delete',
        id: botID,
        server: serverID,
        by: userID
    });

    requestLimit(7000, 'Delete_Tax_Line', botID)
    xhr.send(data);
}

percentage.addEventListener("input", function () {
    let text = document.getElementById("tax_custom_button_percentage_text")
    text.innerHTML = `${percentage.value}%`
});
taxConfigForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "Add_Remove_AutolineChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let taxMessage = custom_tax_message.value
    let buttonName = custom_button_name.value
    let buttonPercentage = tax_custom_button_percentage.value
    let buttonColor = custom_button_color.value
    let messageMode = tax_system_message_mode.value


    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/tax', true);
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
        type: 'settings',
        action: 'manage',
        id: botID,
        server: serverID,
        by: userID,
        taxMessage: taxMessage,
        buttonName: buttonName,
        buttonPercentage: buttonPercentage,
        buttonColor: buttonColor,
        messageMode: messageMode,
    });

    requestLimit(3000, 'Add_Remove_AutolineChannel', botID)
    xhr.send(data);
    createAlert(`success`, `Done`, `Sended the request`)
})
