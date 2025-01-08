var applySetupApplectionForm = document.getElementById("apply_setup_applection_form")
var applyConfigSettingsForm = document.getElementById("apply_config_settings_form")
var applyManageApplectionIdForm = document.getElementById("apply_manage_applection_id_form")
applySetupApplectionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "applySetupApplectionForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let applicationChannel = apply_setup_applection_channel_selector.value
    let requestsChannel = apply_setup_requests_channel_selector.value
    let applicationRole = apply_setup_applection_role_selector.value
    let applicationMessage = apply_setup_applection_message.value || null
    let applicationMessageType = apply_setup_applection_message_type.value

    let question1 = apply_setup_applection_question_1.value || null
    let question2 = apply_setup_applection_question_2.value || null
    let question3 = apply_setup_applection_question_3.value || null
    let question4 = apply_setup_applection_question_4.value || null
    let question5 = apply_setup_applection_question_5.value || null

    
    if(isNaN(applicationChannel)) applicationChannel = null
    if(isNaN(requestsChannel)) requestsChannel = null
    if(isNaN(applicationRole)) applicationRole = null
    if(!applicationMessage || applicationMessage == "") applicationMessage = null


    if(!applicationChannel){
        return createAlert("error", "Error", "Application channel is required.")
    }
    if(!requestsChannel){
        return createAlert("error", "Error", "Requests channel is required.")
    }
    if(!applicationRole){
        return createAlert("error", "Error", "Application role is required.")
    }
    if(!question1){
        return createAlert("error", "Error", "Application Question 1 field is required.")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/apply', true);
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
        action: 'application',
        id: botID,
        server: serverID,
        by: userID,
        applicationChannel:applicationChannel,
        requestsChannel:requestsChannel,
        applicationRole:applicationRole,
        applicationMessage:applicationMessage,
        applicationMessageType:applicationMessageType,
        question1:question1,
        question2:question2,
        question3:question3,
        question4:question4,
        question5:question5,
    });

    requestLimit(10000, 'applySetupApplectionForm', botID)
xhr.send(data);

     apply_setup_applection_question_1.value = ""
     apply_setup_applection_question_2.value = ""
     apply_setup_applection_question_3.value = ""
     apply_setup_applection_question_4.value = ""
     apply_setup_applection_question_5.value = ""
})
applyConfigSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "applyConfigSettingsForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let adminRole = apply_config_settings_admin_role.value || null
    let resultsChannel = apply_config_settings_results_channel.value || null
    let DMmodeAccept = apply_config_settings_dm_mode_accept.value || null
    let DMmodeReject = apply_config_settings_dm_mode_reject.value || null

    if(isNaN(adminRole)) adminRole = null
    if(isNaN(resultsChannel)) resultsChannel = null
    if(DMmodeAccept == "none") DMmodeAccept = null
    if(DMmodeReject == "none") DMmodeReject = null


    if(!adminRole && !resultsChannel && !DMmodeAccept && !DMmodeReject){
        return createAlert("error", "Error", "No thing to save.")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/apply', true);
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
        adminRole: adminRole,
        resultsChannel: resultsChannel,
        DMmodeAccept: DMmodeAccept,
        DMmodeReject: DMmodeReject,
    });

    requestLimit(5000, 'applyConfigSettingsForm', botID)
xhr.send(data);
})

applyManageApplectionIdForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "applyManageApplectionIdForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let ID = apply_applection_manage_id_search.value || null

    if(!ID || ID == ""){
        return createAlert("error", "Error", "Application ID field is required.")
    }
    if(isNaN(ID)){
        return createAlert("error", "Error", "Put vaild Application ID.")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/apply', true);
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

                // -
                let IDInput = document.getElementById("apply_applection_manage_id_search")
                let IDButton = document.getElementById("apply_applection_manage_id_button")
                IDInput.disabled = true;
                IDButton.disabled = true;

                let manageContent = document.getElementById("apply_manage_space")
                let manageSpace = document.getElementById("ticket_manage_space")

                manageContent.innerHTML += `
                <form id="apply_manage_applection_form" onsubmit=" return applyManageApplectionForm(event)">
                <div class="inp">
                    <label for="apply_manage_applection_message">Applection Message</label>
                    <textarea name="" id="apply_manage_applection_message" cols="30" rows="10" maxlength="2000">${res.data?.applyData?.message || ''}</textarea>
                </div>

                <div class="inp">
                    <label for="apply_manage_applection_status">Applection Status</label>
                    <select name="" id="apply_manage_applection_status">
                        <option value="on" ${res.data?.appStatus == 'on' ? 'selected' : ''}>ON</option>
                        <option value="off" ${res.data?.appStatus == 'off' ? 'selected' : ''}>OFF</option>
                    </select>
                </div>

                <div class="appletion-modals-inputs">
                    <h4>Applection Qestions</h4>

                    <div class="inp">
                        <label for="apply_manage_applection_modals_qestions_1">Qestions 1</label>
                        <input id="apply_manage_applection_modals_qestions_1" type="text" maxlength="45" value="${res.data?.applyData?.ask1 || ''}">
                    </div>
                    <div class="inp">
                        <label for="apply_manage_applection_modals_qestions_2">Qestions 2</label>
                        <input id="apply_manage_applection_modals_qestions_2" type="text" maxlength="45" value="${res.data?.applyData?.ask2 || ''}">
                    </div>
                    <div class="inp">
                        <label for="apply_manage_applection_modals_qestions_3">Qestions 3</label>
                        <input id="apply_manage_applection_modals_qestions_3" type="text" maxlength="45" value="${res.data?.applyData?.ask3 || ''}">
                    </div>
                    <div class="inp">
                        <label for="apply_manage_applection_modals_qestions_4">Qestions 4</label>
                        <input id="apply_manage_applection_modals_qestions_4" type="text" maxlength="45" value="${res.data?.applyData?.ask4 || ''}">
                    </div>
                    <div class="inp">
                        <label for="apply_manage_applection_modals_qestions_5">Qestions 5</label>
                        <input id="apply_manage_applection_modals_qestions_5" type="text" maxlength="45" value="${res.data?.applyData?.ask5 || ''}">
                    </div>
                </div>
                <button type="submit" class="apply_manage_applection_save_btn">Save</button>
            </form>
                `;


                manageSpace.classList.toggle("hide")

            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        type: 'manage',
        action: 'get_data_app',
        id: botID,
        server: serverID,
        by: userID,
        appID: ID,
    });

    requestLimit(5000, 'applyManageApplectionIdForm', botID)
xhr.send(data);
})

function applyManageApplectionForm(e) {
    e.preventDefault();
    let colddownCheck = colddowns.filter(d => d.name == "applyManageApplectionForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let ID = apply_applection_manage_id_search.value || null
    let qestion1 = apply_manage_applection_modals_qestions_1.value || null
    let qestion2 = apply_manage_applection_modals_qestions_2.value || null
    let qestion3 = apply_manage_applection_modals_qestions_3.value || null
    let qestion4 = apply_manage_applection_modals_qestions_4.value || null
    let qestion5 = apply_manage_applection_modals_qestions_5.value || null
    let appStatus = apply_manage_applection_status.value
    let appMessage = apply_manage_applection_message.value

    if(!ID || ID == "" || isNaN(ID)){
        return createAlert("error", "Error", "Reload the page and retry.")
    }
    if(!qestion1 || qestion1 == ""){
        return createAlert("error", "Error", "Question 1 field is required.")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/apply', true);
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
        action: 'set_data',
        id: botID,
        server: serverID,
        by: userID,
        appID: ID,
        qestion1:qestion1,
        qestion2:qestion2,
        qestion3:qestion3,
        qestion4:qestion4,
        qestion5:qestion5,
        appStatus:appStatus,
        appMessage:appMessage
    });

    requestLimit(5000, 'applyManageApplectionForm', botID)
xhr.send(data);
}