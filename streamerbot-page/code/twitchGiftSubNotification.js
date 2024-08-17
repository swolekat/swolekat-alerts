const giftsubAlert = document.getElementById('giftsub-alert');
const giftsubName = document.getElementById('giftsub-name');
const giftsubRecipient = document.getElementById('giftsub-recipient');

export const twitchGiftSubNotification = (data) => {
    const {userName, sender} = data;
    return new Promise((resolve) => {
        giftsubRecipient.innerText = userName;
        giftsubName.innerText = sender;
        giftsubAlert.className = 'giftsub-alert alert animate';
        setTimeout(() => {
            giftsubAlert.className = 'giftsub-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};