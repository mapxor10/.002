var selfroleSetupCreatePanelForm = document.getElementById("selfrole_setup_create_panel_form")
selfroleSetupCreatePanelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "selfroleSetupCreatePanelForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let panelChannel = selfrole_setup_panel_channel.value || null
    let panelRole = selfrole_setup_panel_role.value || null
    let panelType = selfrole_setup_panel_type.value || null
    let panelMessage = selfrole_setup_panel_message.value || null
    let panelMessageType = selfrole_setup_panel_message_type.value || null
    let buttonColor = selfrole_setup_panel_button_color.value || null
    let compName = selfrole_setup_panel_button_name.value || null

    if(panelMessage == "") panelMessage = null

    if(isNaN(panelChannel)){
        return createAlert("error", "Error", "Panel channel field is required.")
    }
    if(isNaN(panelRole)){
        return createAlert("error", "Error", "Panel role field is required.")
    }
    if(!compName || compName == ""){
        return createAlert("error", "Error", "Component name field is required.")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/selfrole', true);
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
        action: 'panel',
        id: botID,
        server: serverID,
        by: userID,
        panelChannel:panelChannel,
        panelRole:panelRole,
        panelType:panelType,
        panelMessage:panelMessage,
        panelMessageType:panelMessageType,
        buttonColor:buttonColor,
        compName:compName,
    });
    requestLimit(10000, 'selfroleSetupCreatePanelForm', botID)
xhr.send(data);
})