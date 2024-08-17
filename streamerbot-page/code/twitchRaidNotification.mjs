const raidAlert = document.getElementById('raid-alert');
const raidName = document.getElementById('raid-name');
const raidNumber = document.getElementById('raid-number');

export const twitchRaidNotification = (data) => {
    const {userName, amount} = data;
    return new Promise((resolve) => {
        raidNumber.innerText = amount;
        raidName.innerText = userName;
        raidAlert.className = 'raid-alert alert animate';
        setTimeout(() => {
            raidAlert.className = 'raid-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};