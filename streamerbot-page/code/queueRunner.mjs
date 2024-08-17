import {twitchFollowerNotification} from "./twitchFollowerNotification.mjs";
import {twitchCheerNotification} from "./twitchCheerNotificaiton.mjs";
import {twitchRaidNotification} from "./twitchRaidNotification.mjs";
import {twitchSubNotification} from "./twitchSubNotification.js";
import {twitchGiftSubNotification} from "./twitchGiftSubNotification.js";
import {twitchGiftBombNotification} from "./twitchGiftBombNotification.js";
import {youtubeSubscriberNotification} from "./youtubeSubscriberNotification.mjs";

let isRunning = false;
let queue = [];

const eventTypeToHandler = {
    'twitchFollower': twitchFollowerNotification,
    'twitchCheer': twitchCheerNotification,
    'twitchRaid': twitchRaidNotification,
    'twitchSub': twitchSubNotification,
    'twitchGiftSub': twitchGiftSubNotification,
    'twitchGiftBomb': twitchGiftBombNotification,
    'youtubeSubscriber': youtubeSubscriberNotification,
};

export const runQueue = (event) => {
    const handler = eventTypeToHandler[event.type];
    if(!handler){
        console.error(`No handler found for ${event.type}`);
        return;
    }
    if(queue.length !== 0 || isRunning){
        queue.push(event);
        return;
    }
    processEvent(event);
};

const processEvent = async (event) => {
    const handler = eventTypeToHandler[event.type];
    isRunning = true;
    await handler(event.data);
    isRunning = false;
    if(queue.length > 0){
        const nextEvent = queue.shift();
        processEvent(nextEvent);
        return;
    }
};