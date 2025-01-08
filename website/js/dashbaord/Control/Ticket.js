var ticketSetupForm = document.getElementById("ticket_setup_form")
var ticketManageIdForm = document.getElementById("ticket_manage_panel_id_form")

var addButtonContent = document.getElementById("ticket_manage_add_button_content")
var ticketPanelConfigContent = document.getElementById("ticket_manage_panel_config_content")
var buttonWelcomeMessageArea = document.getElementById("ticket_manage_panel_welcome_message");
var ticketPanelConfigForm = document.getElementById("ticket_manage_panel_config_form")
var ticketManageAddButtonForm = document.getElementById("ticket_manage_add_button_form")

var ticketManageSystemSettingsForm = document.getElementById("ticket_manage_system_settings_form")

var ticketPanelContentForm = document.getElementById("ticket_manage_panel_content_form")
var ticketPanelContent = document.getElementById("ticket_manage_panel_content")
var panelMessageArea = document.getElementById("ticket_manage_panel_content_panel_message");


var ticketPanelThumbnailUploader = document.getElementById("ticket_panel_manage_thumbnail_uploader")
var ticketPanelImageUploader = document.getElementById("ticket_panel_manage_image_uploader")

var ticketManageData = null;
var manageButtonID = null
var ticketPanelThumbnailBase64 = null
var ticketPanelImageBase64 = null

ticketSetupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "ticketSetupForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let channel = ticket_setup_channels_selector.value
    let gategory = ticket_setup_category_selector.value
    let role = ticket_setup_roles_selector.value
    let panelMessage = ticket_setup_panel_message.value
    let welcomeMessage = ticket_setup_welcome_message.value
    let panelMessageType = ticket_setup_panel_message_type.value
    let welcomeMessageType = ticket_setup_welcome_message_type.value
    let buttonName = ticket_setup_button_name.value
    let buttonColor = ticket_setup_button_color_selector.value
    let buttonEmoji = ticket_setup_button_emoji.value || null

    if (isNaN(channel)) {
        return createAlert("error", "Error", "Ticket channel is required.")
    }
    if (isNaN(gategory)) {
        return createAlert("error", "Error", "Ticket gategory is required.")
    }
    if (isNaN(role)) {
        return createAlert("error", "Error", "Ticket support role is required.")
    }
    if (panelMessage == "" || panelMessage.length <= 0) {
        return createAlert("error", "Error", "Panel message field is required.")
    }
    if (welcomeMessage == "" || welcomeMessage.length <= 0) {
        return createAlert("error", "Error", "Welcome message field is required.")
    }
    if (!buttonName || buttonName == "") {
        return createAlert("error", "Error", "Button name field is required.")
    }
    if (buttonName.length > 60) {
        return createAlert("error", "Error", "Button name should be 60 layers at maximum.", "450px")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
        action: 'create_panel',
        id: botID,
        server: serverID,
        by: userID,
        channel: channel,
        gategory: gategory,
        role: role,
        message: panelMessage,
        welcome: welcomeMessage,
        messageType: panelMessageType,
        welcomeType: welcomeMessageType,
        buttonName: buttonName,
        buttonColor: buttonColor,
        buttonEmoji: buttonEmoji
    });

    requestLimit(10000, 'ticketSetupForm', botID)
    xhr.send(data);
})
ticketManageIdForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "ticketManageIdForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let ID = ticket_manage_panel_id_inp.value

    if (!ID || ID == "") {
        return createAlert("error", "Error", "Panel ID field is required.")
    }
    if (isNaN(ID)) {
        return createAlert("error", "Error", "Type valid panel id.")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
                // --
                let IDInput = document.getElementById("ticket_manage_panel_id_inp")
                let IDButton = document.getElementById("ticket_manage_panel_id_btn")
                IDInput.disabled = true;
                IDButton.disabled = true;

                let buttonsContent = document.querySelector("#ticket_manage_buttons_space .btns")
                let manageSpace = document.getElementById("ticket_manage_space")
                let TicketData = res.data?.ticketData
                let buttonsArray = [
                    TicketData?.buttonsData?.button1 || null,
                    TicketData?.buttonsData?.button2 || null,
                    TicketData?.buttonsData?.button3 || null,
                    TicketData?.buttonsData?.button4 || null,
                    TicketData?.buttonsData?.button5 || null,
                ]
                let button5 = TicketData?.buttonsData?.button5 || null

                buttonsArray.forEach((button, index) => {
                    if (!button) return
                    let color = "blue";
                    let name = button.button_name || "Button"
                    if (button.button_color == 1) color = "blue"
                    if (button.button_color == 2) color = "gray"
                    if (button.button_color == 3) color = "green"
                    if (button.button_color == 4) color = "red"
                    buttonsContent.innerHTML += `<button class="ticket_panel_btn ${color}" onclick="Ticket_Manage_Panel_Config(${index + 1})">${name}</button>`;
                })

                if (!button5) {
                    buttonsContent.innerHTML += `<i class="fa-solid fa-plus ticket_panel_add_btn" onclick="Ticket_Manage_Add_Button()"></i>`;
                }
                panelMessageArea.value = TicketData.panel_message || "";
                manageSpace.classList.toggle("hide")
                ticketPanelContent.classList.toggle("hide")

                ticketManageData = res.data?.ticketData
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        type: 'manage',
        action: 'get_panel_data',
        id: botID,
        server: serverID,
        by: userID,
        PanelID: ID,
    });

    requestLimit(3000, 'ticketManageIdForm', botID)
    xhr.send(data);
})
ticketPanelContentForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let colddownCheck = colddowns.filter(d => d.name == "ticketPanelContentForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let panelMessage = ticket_manage_panel_content_panel_message.value
    let ID = ticket_manage_panel_id_inp.value

    if (!panelMessage || panelMessage == "") {
        return createAlert("error", "Error", "Panel message field is required.")
    }
    if (panelMessage == ticketManageData.panel_message && !ticketPanelThumbnailBase64 && !ticketPanelImageBase64) {
        return createAlert("warning", "Warn", "No thing to save.")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
        action: 'panel_manage',
        id: botID,
        server: serverID,
        by: userID,
        PanelID: ID,
        channel: ticketManageData.panal_channelID,
        message: panelMessage,
        thumbnail: ticketPanelThumbnailBase64,
        image: ticketPanelImageBase64
    });

    requestLimit(5000, 'ticketPanelContentForm', botID)
    xhr.send(data);
})
ticketPanelConfigForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "ticketPanelConfigForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let ID = ticket_manage_panel_id_inp.value
    let modal1 = panel_config_modals_1.value || null
    let modal2 = panel_config_modals_2.value || null
    let modal3 = panel_config_modals_3.value || null
    let modal4 = panel_config_modals_4.value || null
    let modal5 = panel_config_modals_5.value || null

    let modal1Type = panel_config_modals_1_type.value || "short"
    let modal2Type = panel_config_modals_2_type.value || "short"
    let modal3Type = panel_config_modals_3_type.value || "short"
    let modal4Type = panel_config_modals_4_type.value || "short"
    let modal5Type = panel_config_modals_5_type.value || "short"

    let welcomeMessage = ticket_manage_panel_welcome_message.value || null

    if (!modal1 && modal2 || !modal1 && modal3 || !modal1 && modal4 || !modal1 && modal5) {
        return createAlert("error", "Error", "Modals should be in order.")
    }
    if (!modal2 && modal3 || !modal2 && modal4 || !modal2 && modal5) {
        return createAlert("error", "Error", "Modals should be in order.")
    }
    if (!modal3 && modal4 || !modal3 && modal5) {
        return createAlert("error", "Error", "Modals should be in order.")
    }
    if (!modal4 && modal5) {
        return createAlert("error", "Error", "Modals should be in order.")
    }

    if (!welcomeMessage || welcomeMessage == "") {
        return createAlert("error", "Error", "Welcome message field is required")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
        action: 'button_manage_modals',
        id: botID,
        server: serverID,
        by: userID,
        PanelID: ID,
        buttonID: manageButtonID,
        welcome: welcomeMessage,
        modal1: modal1,
        modal2: modal2,
        modal3: modal3,
        modal4: modal4,
        modal5: modal5,
        modal1Type: modal1Type,
        modal2Type: modal2Type,
        modal3Type: modal3Type,
        modal4Type: modal4Type,
        modal5Type: modal5Type,
    });

    requestLimit(3000, 'ticketPanelConfigForm', botID)
    xhr.send(data);
})
ticketManageAddButtonForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "ticketManageAddButtonForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let ID = ticket_manage_panel_id_inp.value
    let gategory = ticket_manage_add_button_category_selector.value || null
    let role = ticket_manage_add_button_roles_selector.value || null
    let welcome = ticket_manage_add_button_welcome_message.value || null
    let welcomeType = ticket_manage_add_button_welcome_message_type.value || null
    let buttonName = ticket_manage_add_button_button_name.value || null
    let buttonColor = ticket_manage_add_button_button_color_selector.value || null
    let buttonEmoji = ticket_manage_add_button_button_emoji.value || null



    if (!gategory || isNaN(gategory)) {
        return createAlert("error", "Error", "Ticket gategory field is required")
    }
    if (!role || isNaN(role)) {
        return createAlert("error", "Error", "Support role field is required")
    }
    if (!buttonName) {
        return createAlert("error", "Error", "Button name field is required")
    }
    if (!welcome || welcome == "") {
        return createAlert("error", "Error", "Welcome message field is required")
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
        action: 'manage_addbutton',
        id: botID,
        server: serverID,
        by: userID,
        PanelID: ID,
        channel: ticketManageData.panal_channelID,
        gategory: gategory,
        role: role,
        welcome: welcome,
        welcomeType: welcomeType,
        buttonName: buttonName,
        buttonColor: buttonColor,
        buttonEmoji: buttonEmoji,
    });

    requestLimit(5000, 'ticketManageAddButtonForm', botID)
    xhr.send(data);
})

ticketManageSystemSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "ticketManageSystemSettingsForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let transcriptChannel = ticket_manage_transcript_channel_selector.value || null
    let ticketLimit = ticket_manage_tickets_per_user_input.value || null

    if (isNaN(transcriptChannel)) transcriptChannel = null

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/ticket', true);
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
        action: 'ticket_settings',
        id: botID,
        server: serverID,
        by: userID,
        transcript: transcriptChannel,
        ticketLimit: ticketLimit,
    });

    requestLimit(10000, 'ticketManageSystemSettingsForm', botID)
    xhr.send(data);
})

function Ticket_Manage_Add_Button() {
    addButtonContent.classList.toggle("hide")
    ticketPanelContent.classList.add("hide")
    ticketPanelConfigContent.classList.add("hide")
    if (addButtonContent.classList[1] == "hide") {
        ticketPanelContent.classList.remove("hide")
    }
}

function Ticket_Manage_Panel_Config(buttonID) {
    addButtonContent.classList.add("hide")
    ticketPanelConfigContent.classList.toggle("hide")
    ticketPanelContent.classList.add("hide")
    if (ticketPanelConfigContent.classList[1] == "hide") {
        ticketPanelContent.classList.remove("hide")
    }
    let buttonData = null
    if (buttonID == 1) buttonData = ticketManageData.buttonsData.button1
    if (buttonID == 2) buttonData = ticketManageData.buttonsData.button2
    if (buttonID == 3) buttonData = ticketManageData.buttonsData.button3
    if (buttonID == 4) buttonData = ticketManageData.buttonsData.button4
    if (buttonID == 5) buttonData = ticketManageData.buttonsData.button5
    manageButtonID = buttonID
    buttonWelcomeMessageArea.value = buttonData?.welcome?.message || ""
    let modals = buttonData.modals || []
    let modalsNumber = modals?.length || 0
    let inp1 = document.getElementById("panel_config_modals_1")
    let inp2 = document.getElementById("panel_config_modals_2")
    let inp3 = document.getElementById("panel_config_modals_3")
    let inp4 = document.getElementById("panel_config_modals_4")
    let inp5 = document.getElementById("panel_config_modals_5")

    inp1.value = ""
    inp2.value = ""
    inp3.value = ""
    inp4.value = ""
    inp5.value = ""

    if (modalsNumber != 0) {
        let inp1Type = document.getElementById("panel_config_modals_1_type")
        let inp2Type = document.getElementById("panel_config_modals_2_type")
        let inp3Type = document.getElementById("panel_config_modals_3_type")
        let inp4Type = document.getElementById("panel_config_modals_4_type")
        let inp5Type = document.getElementById("panel_config_modals_5_type")

        if (modalsNumber == 1) {
            inp1.value = modals[0].label || ""
            if (modals[0].type == 1) {
                inp1Type.querySelector("option[value='short']").selected = true;
            } else {
                inp1Type.querySelector("option[value='long']").selected = true;
            }
        }

        if (modalsNumber == 2) {
            inp1.value = modals[0].label || ""
            inp2.value = modals[1].label || ""
            if (modals[0].type == 1) {
                inp1Type.querySelector("option[value='short']").selected = true;
            } else {
                inp1Type.querySelector("option[value='long']").selected = true;
            }
            if (modals[1].type == 1) {
                inp2Type.querySelector("option[value='short']").selected = true;
            } else {
                inp2Type.querySelector("option[value='long']").selected = true;
            }
        }

        if (modalsNumber == 3) {
            inp1.value = modals[0].label || ""
            inp2.value = modals[1].label || ""
            inp3.value = modals[2].label || ""
            if (modals[0].type == 1) {
                inp1Type.querySelector("option[value='short']").selected = true;
            } else {
                inp1Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[1].type == 1) {
                inp2Type.querySelector("option[value='short']").selected = true;
            } else {
                inp2Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[2].type == 1) {
                inp3Type.querySelector("option[value='short']").selected = true;
            } else {
                inp3Type.querySelector("option[value='long']").selected = true;
            }
        }


        if (modalsNumber == 4) {
            inp1.value = modals[0].label || ""
            inp2.value = modals[1].label || ""
            inp3.value = modals[2].label || ""
            inp4.value = modals[3].label || ""
            if (modals[0].type == 1) {
                inp1Type.querySelector("option[value='short']").selected = true;
            } else {
                inp1Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[1].type == 1) {
                inp2Type.querySelector("option[value='short']").selected = true;
            } else {
                inp2Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[2].type == 1) {
                inp3Type.querySelector("option[value='short']").selected = true;
            } else {
                inp3Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[3].type == 1) {
                inp4Type.querySelector("option[value='short']").selected = true;
            } else {
                inp4Type.querySelector("option[value='long']").selected = true;
            }
        }

        if (modalsNumber == 5) {
            inp1.value = modals[0].label || ""
            inp2.value = modals[1].label || ""
            inp3.value = modals[2].label || ""
            inp4.value = modals[3].label || ""
            inp5.value = modals[4].label || ""
            if (modals[0].type == 1) {
                inp1Type.querySelector("option[value='short']").selected = true;
            } else {
                inp1Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[1].type == 1) {
                inp2Type.querySelector("option[value='short']").selected = true;
            } else {
                inp2Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[2].type == 1) {
                inp3Type.querySelector("option[value='short']").selected = true;
            } else {
                inp3Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[3].type == 1) {
                inp4Type.querySelector("option[value='short']").selected = true;
            } else {
                inp4Type.querySelector("option[value='long']").selected = true;
            }

            if (modals[4].type == 1) {
                inp5Type.querySelector("option[value='short']").selected = true;
            } else {
                inp5Type.querySelector("option[value='long']").selected = true;
            }
        }

    }
}
ticketPanelThumbnailUploader.onchange = function () {
    let image = document.getElementById("ticket_panel_manage_thumbnail_holder")
    let file = new FileReader();
    file.readAsDataURL(ticketPanelThumbnailUploader.files[0])
    file.onload = function (e) {
        image.src = file.result;
        ticketPanelThumbnailBase64 = e.target.result
    }
}
ticketPanelImageUploader.onchange = function () {
    let image = document.getElementById("ticket_panel_manage_image_holder")
    let file = new FileReader();
    file.readAsDataURL(ticketPanelImageUploader.files[0])
    file.onload = function (e) {
        image.src = file.result;
        ticketPanelImageBase64 = e.target.result
    }
}