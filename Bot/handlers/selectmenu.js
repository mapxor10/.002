const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const FolderPath = path.join(__dirname, '../selectmenu');

    fs.readdirSync(FolderPath).forEach((folder) => {
        const folderPath = path.join(FolderPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const commands = require(filePath);
            if (commands.name) {
                client.selectmenu.set(commands.name, commands);
            } else {
                console.log(`ERROR ${file} SELECTMENU`);
                continue;
            }
        }
    });
}
