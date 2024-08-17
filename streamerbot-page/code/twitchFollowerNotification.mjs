const followerAlert = document.getElementById('follower-alert');
const followerName = document.getElementById('follower-name');

export const twitchFollowerNotification = (data) => {
    const {userName} = data;
    return new Promise((resolve) => {
        followerName.innerText = userName;
        followerAlert.className = 'follower-alert alert animate';
        setTimeout(() => {
            followerAlert.className = 'follower-alert alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};