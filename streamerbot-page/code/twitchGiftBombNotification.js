const bulksubAlert = document.getElementById('bulksub-alert');
const bulksubName = document.getElementById('bulksub-name');
const bulksubNumber = document.getElementById('bulksub-number');

export const twitchGiftBombNotification = (data) => {
    const {userName, amount} = data;
    return new Promise((resolve) => {
        bulksubNumber.innerText = amount;
        bulksubName.innerText = userName;
        bulksubAlert.className = 'bulksub-alert alert animate';
        setTimeout(() => {
            bulksubAlert.className = 'bulksub-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};