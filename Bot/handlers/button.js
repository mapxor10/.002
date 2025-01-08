// const fs = require('fs');

// module.exports = (client) => {
//     fs.readdirSync('./buttons').forEach((folder) => {
//         const commandFiles = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith('.js'));
//         for(file of commandFiles) {
//             let commands = require(`../buttons/${folder}/${file}`);
//             if(commands.name) {
//                 client.button.set(commands.name, commands);

//             }else{

//                 continue;
//             }
//         }
//     });
// }


const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const FolderPath = path.join(__dirname, '../buttons');

    fs.readdirSync(FolderPath).forEach((folder) => {
        const buttonFolder = path.join(FolderPath, folder);
        const commandFiles = fs.readdirSync(buttonFolder).filter(file => file.endsWith('.js'));
        for (file of commandFiles) {
            const filePath = path.join(buttonFolder, file);
            let commands = require(filePath);
            if (commands.name) {
                client.button.set(commands.name, commands);
            } else {
                continue;
            }
        }
    });
}
