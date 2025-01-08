function addAliaseInput(event, input, inputParent) {
    if (event.key === " " || event.keyCode === 32) {
        event.preventDefault();
    } else if (event.key === "Enter" || event.keyCode === 13) {
        let colddownCheck = colddowns.filter(d => d.name == "addAliaseInput" && d.bot == botID && d.user == userID)[0]
        if (colddownCheck) {
            return createAlert('warning', 'Warn', 'You do that too fast.!')
        }
        let botID = input.dataset.id
        let command = input.dataset.command
        let aliase = input.value
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/bot/manage/aliases', true);
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

                    if (res.data?.updatedAliases) {
                        inputParent.querySelectorAll(".aliase").forEach(alias => {
                            alias.remove();
                        });

                        res.data?.updatedAliases.forEach(aliase => {
                            let updatedAliase = document.createElement("span");

                            updatedAliase.textContent = aliase;
                            updatedAliase.classList.add("aliase");
                            updatedAliase.innerHTML = `<i class='bx bx-x' data-command="${command}" data-id="${botID}" data-aliase="${aliase.aliase}" onclick="removeAliaseInput(this, this.parentElement.parentElement)"></i> ${aliase.aliase}`
                            inputParent.insertBefore(updatedAliase, input);
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
            command: command,
            aliase: aliase
        });

        requestLimit(3000, 'addAliaseInput', botID)
        xhr.send(data);
        input.disabled = true;
    }
}
function removeAliaseInput(a, inputParent) {
    let colddownCheck = colddowns.filter(d => d.name == "removeAliaseInput" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let botID = a.dataset.id
    let command = a.dataset.command
    let aliase = a.dataset.aliase
    let input = inputParent.querySelector('#bot__aliase__add__input')

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/manage/aliases', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message)
                }

                if (res.data?.updatedAliases) {
                    inputParent.querySelectorAll(".aliase").forEach(alias => {
                        alias.remove();
                    });

                    res.data?.updatedAliases.forEach(aliase => {
                        let updatedAliase = document.createElement("span");

                        updatedAliase.textContent = aliase;
                        updatedAliase.classList.add("aliase");
                        updatedAliase.innerHTML = `<i class='bx bx-x' data-command="${command}" data-id="${botID}" data-aliase="${aliase.aliase}" onclick="removeAliaseInput(this, this.parentElement.parentElement)"></i> ${aliase.aliase}`
                        inputParent.insertBefore(updatedAliase, input);
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
        command: command,
        aliase: aliase
    });

    requestLimit(5000, 'removeAliaseInput', botID)
    xhr.send(data);
}