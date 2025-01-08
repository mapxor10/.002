function commandsSubMenuToggle(command) {
    let menu = command.querySelector('.bot_command_submenu')
    menu.classList.toggle('hide')
}

function serverListFunction() {
    let alertCard = document.getElementById('alert_card_servers');
    alertCard.style.display = "flex"
}

function commandStatusChanger(input) {
    let status = input.checked
    let command = input.dataset.command
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/manage/commandstatus', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        action: 'change',
        userId: userID,
        bot: botID,
        status: status,
        command: command,
    });

    xhr.send(data);
}