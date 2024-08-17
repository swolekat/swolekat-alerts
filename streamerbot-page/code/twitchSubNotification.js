const subscriberAlert = document.getElementById('subscriber-alert');
const subscriberName = document.getElementById('subscriber-name');
const subscriberNumber = document.getElementById('subscriber-number');

export const twitchSubNotification = (data) => {
    const {userName, amount} = data;
    return new Promise((resolve) => {
        subscriberNumber.innerText = amount;
        subscriberName.innerText = userName;
        subscriberAlert.className = 'subscriber-alert alert animate';
        setTimeout(() => {
            subscriberAlert.className = 'subscriber-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};