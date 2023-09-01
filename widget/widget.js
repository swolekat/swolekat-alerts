const followerAlert = document.getElementById('follower-alert');
const followerName = document.getElementById('follower-name');
const cheerAlert = document.getElementById('cheer-alert');
const cheerName = document.getElementById('cheer-name');
const cheerNumber = document.getElementById('cheer-number');

let isAlerting = false;
let queue = [];
const CHEER_THRESHOLD = 100;

const processQueue = () => {
    const latestEvent = queue.shift();
    setTimeout(() => {
        if(latestEvent.type === 'follower'){
            doFollowerNotification(latestEvent.event);
        }
        if(latestEvent.type === 'cheer'){
            doCheerNotification(latestEvent.event);
        }
    }, 5000);

};

const onRaid = (event) => {
    // const name = event?.name;
    // const amount = event?.amount;
    // data.latestRaider = name;
    // if(!data.raidMessages){
    //     return;
    // }
    // const msgId = `raid-${name}`;
    // const html = createRaidMessageHtml({displayName: name, msgId , amount});
    // showMessage(msgId, html);
};

const doFollowerNotification = (event) => {
    followerName.innerText = event?.name;
    followerAlert.className = 'follower-alert alert animate';
    setTimeout(() => {
        followerAlert.className = 'follower-alert alert';
        setTimeout(() => {
            isAlerting = false;
            if(queue.length > 0){
                processQueue();
            }
        }, 5000);
    }, 10000);
};

const onFollower = (event) => {
    if(queue.length !== 0 || isAlerting){
        queue.push({
            type: 'follower',
            event,
        });
        return;
    }
    isAlerting = true;
    doFollowerNotification(event);
};

const onSubscriber = (event) => {
    // const name = event?.name;
    // data.latestSubscriber = name;
    // if(!data.subMessages){
    //     return;
    // }
    // const msgId = `subscriber-${name}`;
    // const html = createSubMessageHtml({displayName: name, msgId });
    // showMessage(msgId, html);
};

const doCheerNotification = (event) => {
    cheerName.innerText = event?.name;
    cheerNumber.innerText = event?.amount;
    cheerAlert.className = 'cheer-alert alert animate';
    // setTimeout(() => {
    //     cheerAlert.className = 'cheer-alert alert';
    //     setTimeout(() => {
    //         isAlerting = false;
    //         if(queue.length > 0){
    //             processQueue();
    //         }
    //     }, 5000);
    //
    // }, 10000);
};

const onCheer = (event) => {
    if(event.amount < CHEER_THRESHOLD){
        return;
    }
    if(queue.length !== 0 || isAlerting){
        queue.push({
            type: 'cheer',
            event,
        });
        return;
    }
    isAlerting = true;
    doCheerNotification(event);
    // const name = event?.name;
    // data.latestCheerer = name;
};

const eventListenerToHandlerMap = {
    'raid-latest': onRaid,
    'follower-latest': onFollower,
    'subscriber-latest': onSubscriber,
    'cheer-latest': onCheer,
};

window.addEventListener('onEventReceived', obj => {
    const {listener, event} = obj?.detail || {};
    const handler = eventListenerToHandlerMap[listener];
    if (!handler) {
        return;
    }
    handler(event);
})