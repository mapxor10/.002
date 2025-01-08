var feedbackConfigForm = document.getElementById("feedback_config_settings_form")
var FeedbackUploader = document.getElementById("line_uploader_input")
function Add_Remove_FeedbackChannel(channel) {
    let colddownCheck = colddowns.filter(d => d.name == "Add_Remove_FeedbackChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let channelID = channel.id
    let action = channel.dataset.action

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/feedback', true);
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

    requestLimit(3000, 'Add_Remove_AutolineChannel', botID)
    xhr.send(data);
}
FeedbackUploader.onchange = function () {
    let line = document.getElementById("line__holder")
    let file = new FileReader();
    file.readAsDataURL(FeedbackUploader.files[0])
    file.onload = function (e) {
        line.src = file.result;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/bot/control/feedback', true);
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
function Delete_Feedback_Line() {
    let colddownCheck = colddowns.filter(d => d.name == "Delete_Feedback_Line" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let line = document.getElementById("line__holder")
    line.src = "";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/feedback', true);
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

    requestLimit(7000, 'Delete_Feedback_Line', botID)
    xhr.send(data);
}
feedbackConfigForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "feedbackConfigForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let emoji = emoji_input.value

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/feedback', true);
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
        emoji: emoji,
    });
    requestLimit(10000, 'feedbackConfigForm', botID)
    xhr.send(data);
})
