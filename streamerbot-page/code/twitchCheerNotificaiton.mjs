const cheerAlert = document.getElementById('cheer-alert');
const cheerName = document.getElementById('cheer-name');
const cheerNumber = document.getElementById('cheer-number');

export const twitchCheerNotification = (data) => {
    const {userName, amount} = data;
    return new Promise((resolve) => {
        cheerName.innerText = userName;
        cheerNumber.innerText = amount;
        cheerAlert.className = 'cheer-alert alert animate';
        setTimeout(() => {
            cheerAlert.className = 'cheer-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};