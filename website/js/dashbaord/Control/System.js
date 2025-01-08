var addReplyForm = document.getElementById("add_reply_form")

addReplyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let colddownCheck = colddowns.filter(d => d.name == "addReplyForm" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let Replyword = e.target.replyword.value
    let include = e.target.reply_includes_the_message.checked
    let sendAsReply = e.target.send_as_reply.checked
    let response = e.target.word_response.value
    let enabledRole = e.target.enabled_role.value

    if (!Replyword || Replyword == '') {
        return createAlert('error', 'Error', 'Word field is required')
    }

    if (!response || response == '') {
        return createAlert('error', 'Error', 'Response field is required')
    }

    if (isNaN(enabledRole)) enabledRole = null

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/system', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message, res.data.alert.width)
                }
                if (res?.data?.replies) {
                    let manageContent = document.getElementById("manage__replies__content")
                    manageContent.querySelectorAll('.reply').forEach(reply => {
                        reply.remove()
                    })
                    res?.data?.replies.forEach(reply => {
                        let newReply = document.createElement('div');
                        newReply.classList.add('reply')
                        newReply.innerHTML = `
                        <div class="title_content" onclick="replyManageMenuToggle(this.parentElement)">
                        <h4>${reply.word}</h4>
                        <div class="buttons">
                        <button class="comp_btn8" data-reply="${reply.word}" onclick="removeReplyFunction(this)">Delete</button>
                        <i class='bx bxs-down-arrow c-w'></i>
                        </div>
                    </div>
                    <div class="submenu hide">
                        <form class="add__reply__form" id="edit_reply_form">
                            <div class="inp">
                                <h4>Target word</h4>
                                <input type="text" placeholder="${reply.word}" name="word" id="replyword" disabled value="${reply.word}">
                            </div>
                            <div class="inp2">
                                <div>
                                <input type="checkbox" id="reply_includes_the_message" name="reply_includes_the_message" ${reply.includes ? 'checked' : ''}>
                                <label for="">search for word in message</label>
                                </div>
                                <div>
                                    <input id="send_as_reply" type="checkbox" name="send_as_reply" ${reply.reply ? 'checked' : ''}>
                                    <label for="">Send as reply</label>
                                </div>
                            </div>
                            <div class="inp">
                                <h4>Response</h4>
                                <textarea name="word_response" id="word_response" cols="30" rows="10">${reply.responses[0]}</textarea>
                            </div>
                            <div class="inp">
                                <h4>Enabled role</h4>
                                <select name="enabled_role" id="enabled_role">
                                <option selected value="none">Select...</option>
                                ${res.data.roles.map(role => {
                            let selected = (reply.role == role.id) ? 'selected' : '';
                            return `<option value="${role.id}" ${selected}>${role.name} | ${role.id}</option>`;
                        })}
                            </select>
                            
                            </div>
                            <button type="submit" class="comp_btn4 ml-a">Save</button>
                        </form>
                    </div>
                        `
                        manageContent.appendChild(newReply);
                    })
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        type: 'reply',
        action: 'add',
        id: botID,
        server: serverID,
        by: userID,
        Replyword: Replyword,
        response: response,
        include: include,
        sendAsReply: sendAsReply,
        enabledRole: enabledRole
    });

    requestLimit(3000, 'addReplyForm', botID)
    xhr.send(data);
    e.target.replyword.value = ''
    e.target.reply_includes_the_message.checked = false
    e.target.send_as_reply.checked = false
    e.target.word_response.value = ''
    e.target.enabled_role.value = 'none'
})

function removeReplyFunction(r) {
    let colddownCheck = colddowns.filter(d => d.name == "removeReplyFunction" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let reply = r.dataset.reply
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/system', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message, res.data.alert.width)
                }
                if (res?.data?.replies) {
                    let manageContent = document.getElementById("manage__replies__content")
                    manageContent.querySelectorAll('.reply').forEach(reply => {
                        reply.remove()
                    })
                    res?.data?.replies.forEach(reply => {
                        let newReply = document.createElement('div');
                        newReply.classList.add('reply')
                        newReply.innerHTML = `
                        <div class="title_content" onclick="replyManageMenuToggle(this.parentElement)">
                        <h4>${reply.word}</h4>
                        <div class="buttons">
                        <button class="comp_btn8" data-reply="${reply.word}" onclick="removeReplyFunction(this)">Delete</button>
                        <i class='bx bxs-down-arrow c-w'></i>
                        </div>
                    </div>
                    <div class="submenu hide">
                        <form class="add__reply__form" id="edit_reply_form">
                            <div class="inp">
                                <h4>Target word</h4>
                                <input type="text" placeholder="${reply.word}" name="word" id="replyword" disabled value="${reply.word}">
                            </div>
                            <div class="inp2">
                                <div>
                                <input type="checkbox" id="reply_includes_the_message" name="reply_includes_the_message" ${reply.includes ? 'checked' : ''}>
                                <label for="">search for word in message</label>
                                </div>
                                <div>
                                    <input id="send_as_reply" type="checkbox" name="send_as_reply" ${reply.reply ? 'checked' : ''}>
                                    <label for="">Send as reply</label>
                                </div>
                            </div>
                            <div class="inp">
                                <h4>Response</h4>
                                <textarea name="word_response" id="word_response" cols="30" rows="10">${reply.responses[0]}</textarea>
                            </div>
                            <div class="inp">
                                <h4>Enabled role</h4>
                                <select name="enabled_role" id="enabled_role">
                                <option selected value="none">Select...</option>
                                ${res.data.roles.map(role => {
                            let selected = (reply.role == role.id) ? 'selected' : '';
                            return `<option value="${role.id}" ${selected}>${role.name} | ${role.id}</option>`;
                        })}
                            </select>
                            
                            </div>
                            <button type="submit" class="comp_btn4 ml-a">Save</button>
                        </form>
                    </div>
                        `
                        manageContent.appendChild(newReply);
                    })
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        type: 'reply',
        action: 'remove',
        id: botID,
        server: serverID,
        by: userID,
        Replyword: reply,
    });
    requestLimit(3000, 'removeReplyFunction', botID)
    xhr.send(data);
}

function editReplyFunction(r) {
    let colddownCheck = colddowns.filter(d => d.name == "editReplyFunction" && d.bot == botID && d.user == userID)[0]
    if (colddownCheck) {
        return createAlert('warning', 'Warn', 'You do that too fast.!')
    }
    let Replyword = r.replyword.value
    let include = r.reply_includes_the_message.checked
    let sendAsReply = r.send_as_reply.checked
    let response = r.word_response.value
    let enabledRole = r.enabled_role.value

    if (!response || response == '') {
        return createAlert('error', 'Error', 'Response field is required')
    }

    if (isNaN(enabledRole)) enabledRole = null


    if (!response || response == '') {
        return createAlert('error', 'Error', 'Response field is required')
    }

    if (isNaN(enabledRole)) enabledRole = null

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/bot/control/system', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                if (res.data?.alert?.active == true) {
                    createAlert(res.data.alert.type, res.data.alert.title, res.data.alert.message, res.data.alert.width)
                }
            } else {
                console.error('error');
            }
        }
    };

    var data = JSON.stringify({
        type: 'reply',
        action: 'edit',
        id: botID,
        server: serverID,
        by: userID,
        Replyword: Replyword,
        response: response,
        include: include,
        sendAsReply: sendAsReply,
        enabledRole: enabledRole
    });

    requestLimit(5000, 'editReplyFunction', botID)
    xhr.send(data);
}



function replyManageMenuToggle(p) {
    p.querySelector('.submenu').classList.toggle('hide')
}