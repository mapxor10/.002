function loggingEventChannel(e) {
    let colddownCheck = colddowns.filter(d => d.name == "loggingEventChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let event = e.dataset.event
    let channel = e.value
    if(isNaN(channel)) channel = null

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/log', true);
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
        type: 'setup',
        action: 'event',
        id: botID,
        server: serverID,
        by: userID,
        event:event,
        channel:channel
    });

    requestLimit(3000, 'loggingEventChannel', botID)
xhr.send(data);
}

function loggingEventColor(e) {
    let colddownCheck = colddowns.filter(d => d.name == "loggingEventColor" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let event = e.dataset.event
    let color = e.value


    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/log', true);
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
        type: 'manage',
        action: 'event_color',
        id: botID,
        server: serverID,
        by: userID,
        event:event,
        color:color
    });

    requestLimit(3000, 'Add_Remove_AutolineChannel', botID)
xhr.send(data);
}