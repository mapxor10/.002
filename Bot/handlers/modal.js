const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const FolderPath = path.join(__dirname, '../modals'); // تحديد مسار مجلد الـ modals

    fs.readdirSync(FolderPath).forEach((folder) => {
        const folderPath = path.join(FolderPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        for (file of commandFiles) {
            const filePath = path.join(folderPath, file);
            let commands = require(filePath);
            if (commands.name) {
                client.modal.set(commands.name, commands);
            } else {
                continue;
            }
        }
    });
}
