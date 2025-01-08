var SuggestionUploader = document.getElementById("line_uploader_input")
function Add_Remove_SuggestionChannel(channel) {
    let colddownCheck = colddowns.filter(d => d.name == "Add_Remove_SuggestionChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    var channelID = channel.id
    var action = channel.dataset.action

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/suggestion', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (action == "add") {
                    channel.dataset.action = 'remove'
                    channel.innerHTML = "Remove";
                    channel.style.background = "#dc3545"
                } else {
                    channel.dataset.action = 'add'
                    channel.innerHTML = "Add";
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

    requestLimit(3000, 'Add_Remove_SuggestionChannel', botID)
    xhr.send(data);

}
SuggestionUploader.onchange = function () {
    var line = document.getElementById("line__holder")
    var file = new FileReader();
    file.readAsDataURL(SuggestionUploader.files[0])
    file.onload = function (e) {
        line.src = file.result;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/bot/control/suggestion', true);
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
function Delete_Suggestion_Line() {
    let colddownCheck = colddowns.filter(d => d.name == "Delete_Suggestion_Line" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    var line = document.getElementById("line__holder")
    line.src = "";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/suggestion', true);
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

    requestLimit(7000, 'Add_Remove_AutolineChannel', botID)
    xhr.send(data);
}