const youtubeSubscriberAlert = document.getElementById('youtube-subscriber-alert');
const youtubeSubscriberName = document.getElementById('youtube-subscriber-name');

export const youtubeSubscriberNotification = (data) => {
    const {userName} = data;
    return new Promise((resolve) => {
        youtubeSubscriberName.innerText = userName;
        youtubeSubscriberAlert.className = 'youtube-subscriber alert animate';
        setTimeout(() => {
            youtubeSubscriberAlert.className = 'youtube-subscriber alert';
            setTimeout(() => {
                resolve();
            }, 5000);
        }, 10000);
    });
};