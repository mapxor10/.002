let colddowns = []
if(localStorage.colddowns != null){
    colddowns = JSON.parse(localStorage.colddowns)
}

function requestLimit(time, item, bot) {
    if(isNaN(time)) return
    colddowns.push(
        {
            name: item,
            time: time,
            bot: bot,
            user: userID
        }
        )
        localStorage.setItem(`colddowns`, JSON.stringify(colddowns))
}
setInterval(() =>{
    if(colddowns.length){
        let tt = []
        colddowns.forEach(c =>{
            if(c.time <= 0) return
            c.time  = c.time - 1000
            tt.push(
                {
                    name: c.name,
                    time: c.time,
                    bot: c.bot,
                    user: c.user
                }
            )
        })
        colddowns = tt
        localStorage.setItem(`colddowns`, JSON.stringify(colddowns))
    }
}, 1000)
