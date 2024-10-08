const BITS_TO_IGNORE = [300, 420, 500, 690];

const followerAlert = document.getElementById('follower-alert');
const followerName = document.getElementById('follower-name');

const cheerAlert = document.getElementById('cheer-alert');
const cheerName = document.getElementById('cheer-name');
const cheerNumber = document.getElementById('cheer-number');

const subscriberAlert = document.getElementById('subscriber-alert');
const subscriberName = document.getElementById('subscriber-name');
const subscriberImage = document.getElementById('subscriber-image');
const subscriberNumber = document.getElementById('subscriber-number');

const giftsubAlert = document.getElementById('giftsub-alert');
const giftsubName = document.getElementById('giftsub-name');
const giftsubRecipient = document.getElementById('giftsub-recipient');

const bulksubAlert = document.getElementById('bulksub-alert');
const bulksubName = document.getElementById('bulksub-name');
const bulksubNumber = document.getElementById('bulksub-number');

let isAlerting = false;
let queue = [];
const CHEER_THRESHOLD = 100;

const processQueue = () => {
    if(queue.length === 0){
        isAlerting = false;
        return;
    }
    const latestEvent = queue.shift();
    if(latestEvent.type === 'subscriber'){
        doFollowerNotification(latestEvent.event);
    }
    // if(latestEvent.type === 'cheer'){
    //     doCheerNotification(latestEvent.event);
    // }
    //
    // if(latestEvent.type === 'subscriber'){
    //     doSubscriberNotification(latestEvent.event);
    // }
    //
    // if(latestEvent.type === 'giftsub'){
    //     doGiftsubNotification(latestEvent.event);
    // }
    //
    // if(latestEvent.type === 'bulksub'){
    //     doBulksubNotification(latestEvent.event);
    // }
};

// const onRaid = (event) => {
//     if(queue.length !== 0 || isAlerting){
//         queue.push({
//             type: 'raid',
//             event,
//         });
//         return;
//     }
//     doRaidNotification(event);
// };

const doFollowerNotification = (event) => {
    console.log('alerting');
    isAlerting = true;
    followerName.innerText = event?.data?.displayName;
    followerAlert.className = 'follower-alert alert animate';
    setTimeout(() => {
        followerAlert.className = 'follower-alert alert';
        setTimeout(() => {
            processQueue();
        }, 5000);
    }, 10000);
};

const onFollower = (event) => {
    if(queue.length !== 0 || isAlerting){
        queue.push({
            type: 'subscriber',
            event,
        });
        return;
    }
    doFollowerNotification(event);
};

// const doSubscriberNotification = (event) => {
//     isAlerting = true;
//     subscriberNumber.innerText = event?.amount;
//     subscriberName.innerText = event?.name;
//     subscriberAlert.className = 'subscriber-alert alert animate';
//     setTimeout(() => {
//         subscriberAlert.className = 'subscriber-alert alert';
//         setTimeout(() => {
//             processQueue();
//         }, 5000);
//     }, 10000);
// };
//
// const doGiftsubNotification = (event) => {
//     isAlerting = true;
//     giftsubRecipient.innerText = event?.name;
//     giftsubName.innerText = event?.sender;
//     giftsubAlert.className = 'giftsub-alert alert animate';
//     setTimeout(() => {
//         giftsubAlert.className = 'giftsub-alert alert';
//         setTimeout(() => {
//             processQueue();
//         }, 5000);
//     }, 10000);
// };
//
// const doBulksubNotification = (event) => {
//     isAlerting = true;
//     bulksubNumber.innerText = event?.amount;
//     bulksubName.innerText = event?.name;
//     bulksubAlert.className = 'bulksub-alert alert animate';
//     setTimeout(() => {
//         bulksubAlert.className = 'bulksub-alert alert';
//         setTimeout(() => {
//             processQueue();
//         }, 5000);
//     }, 10000);
// };
//
// const onSubscriber = (event) => {
//     debugger;
//     if(event.isCommunityGift){
//         return;
//     }
//     if(event.bulkGifted){
//         if(queue.length !== 0 || isAlerting){
//             queue.push({
//                 type: 'bulksub',
//                 event,
//             });
//             return;
//         }
//         doBulksubNotification(event);
//         return;
//     }
//
//     if(event.gifted){
//         if(queue.length !== 0 || isAlerting){
//             queue.push({
//                 type: 'giftsub',
//                 event,
//             });
//             return;
//         }
//         doGiftsubNotification(event);
//         return;
//     }
//
//     if(queue.length !== 0 || isAlerting){
//         queue.push({
//             type: 'subscriber',
//             event,
//         });
//         return;
//     }
//     doSubscriberNotification(event);
// };
//
// const doCheerNotification = (event) => {
//     if(BITS_TO_IGNORE.includes(event?.amount)){
//         return;
//     }
//     isAlerting = true;
//     cheerName.innerText = event?.name;
//     cheerNumber.innerText = event?.amount;
//     cheerAlert.className = 'cheer-alert alert animate';
//     setTimeout(() => {
//         cheerAlert.className = 'cheer-alert alert';
//         setTimeout(() => {
//             processQueue();
//         }, 5000);
//     }, 10000);
// };
//
// const onCheer = (event) => {
//     if(event.amount < CHEER_THRESHOLD){
//         return;
//     }
//     if(isAlerting){
//         queue.push({
//             type: 'cheer',
//             event,
//         });
//         return;
//     }
//     doCheerNotification(event);
// };

const eventListenerToHandlerMap = {
    'subscriber': onFollower,
    // 'subscriber-latest': onSubscriber,
    // 'cheer-latest': onCheer,
    // do these once you get fan funding
    // 'superchat': onSuperchat
    // 'sponsor': on Membership
};

window.addEventListener('onEventReceived', obj => {
    /*
    subscriber => new sub
    superchat
    sponsor => membership
     */
    const {event} = obj?.detail || {};
    const {type, isMock} = event;
    if(isMock){
        return;
    }
    const handler = eventListenerToHandlerMap[type];
    if (!handler) {
        console.log('couldnt find handler');
        return;
    }
    handler(event);
})