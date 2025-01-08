function addEnableChannelInput(event, input, inputParent) {
    let colddownCheck = colddowns.filter(d => d.name == "Add_Remove_AutolineChannel" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let botID = input.dataset.id
    let serverID = input.dataset.server
    let command = input.dataset.command
    let channel = input.value

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/manage/commandchannels', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            input.disabled = false;
            input.value = ''
            input.focus()
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message)
                }

                if (res.data?.updatedChannels) {
                    inputParent.querySelectorAll(".channel").forEach(alias => {
                        alias.remove();
                    });

                    res.data?.updatedChannels.forEach(channel => {
                        let updatedChannels = document.createElement("span");
                        updatedChannels.textContent = channel.name;
                        updatedChannels.classList.add("channel");
                        updatedChannels.innerHTML = `<i class='bx bx-x' data-command="${command}" data-id="${botID}" data-server="${serverID}" data-channel="${channel.id}" onclick="removeEnableChannelInput(this, this.parentElement.parentElement)"></i> ${channel.name}`
                        inputParent.insertBefore(updatedChannels, input);
                    })
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        action: 'add',
        userId: userID,
        bot: botID,
        server: serverID,
        command: command,
        channel: channel
    });

    requestLimit(3000, 'Add_Remove_AutolineChannel', botID)
    xhr.send(data);
    input.disabled = true;
}
function removeEnableChannelInput(a, inputParent) {
    let colddownCheck = colddowns.filter(d => d.name == "removeEnableChannelInput" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let botID = a.dataset.id
    let serverID = a.dataset.server
    let command = a.dataset.command
    let channel = a.dataset.channel
    let input = inputParent.querySelector('#bot__enable_channel__input')

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/manage/commandchannels', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message)
                }

                if (res.data?.updatedChannels) {
                    inputParent.querySelectorAll(".channel").forEach(alias => {
                        alias.remove();
                    });
                    res.data?.updatedChannels.forEach(channel => {
                        let updatedChannels = document.createElement("span");
                        updatedChannels.textContent = channel.name;
                        updatedChannels.classList.add("channel");
                        updatedChannels.innerHTML = `<i class='bx bx-x' data-command="${command}" data-id="${botID}" data-server="${serverID}" data-channel="${channel.id}" onclick="removeEnableChannelInput(this, this.parentElement.parentElement)"></i> ${channel.name}`
                        inputParent.insertBefore(updatedChannels, input);
                    })
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        action: 'remove',
        userId: userID,
        bot: botID,
        server: serverID,
        command: command,
        channel: channel
    });

    requestLimit(3000, 'removeEnableChannelInput', botID)
    xhr.send(data);
}