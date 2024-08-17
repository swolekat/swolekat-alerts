import {CHEER_THRESHOLD, WEBSOCKET_URL, BITS_TO_IGNORE} from "./constants.mjs";
import {runQueue} from "./queueRunner.mjs";

let socket;

export function initializeConnections() {
    // Streamer.Bot websocket connection
    console.debug('Streamer.Bot is enabled');

    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
        let subscribeEvents = {};
        subscribeEvents['Twitch'] = [
            "Follow",
            "Cheer",
            "Raid",
            "Sub",
            "ReSub",
            "GiftSub",
            "GiftBomb"
        ];
        subscribeEvents['YouTube'] = [
            "NewSponsor",
            "NewSubscriber",
            "SuperChat"
        ];


        if (Object.keys(subscribeEvents).length > 0) {
            const s = {
                "request": "Subscribe",
                "id": "fancy-notifications",
                "events": subscribeEvents
            };

            socket.send(JSON.stringify(s));
        } else {
            console.debug('Streamer.Bot does not have any events to subscribe to');
        }

        console.debug(['Connected to Streamer.Bot socket:', socket]);
    };

    socket.onclose = function () {
        console.warn('Disconnected from Streamer.Bot socket.');
        setTimeout(initializeConnections, 10000);
    };

    socket.onmessage = async (event) => {
        const wsdata = JSON.parse(event.data);

        console.debug(['Event', wsdata]);

        if (wsdata.id === 'fancy-notifications') {
            console.debug([`SUBSCRIBE: ${wsdata.status}`, wsdata]);
            return;
        }
        if (!wsdata.event) {
            console.warn(['Event source not implemented', event]);
            return;
        }
        if (wsdata.event.source !== 'Twitch' && wsdata.event.source !== 'YouTube') {
            return;
        }
        if (wsdata.event.source === 'Twitch') {
            if (wsdata.event.type === 'Follow') {
                const {user_name} = wsdata.data;
                runQueue({
                    type: 'twitchFollower',
                    data: {
                        userName: user_name,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'Cheer') {
                const {displayName, bits} = wsdata.data.message;
                if(bits < CHEER_THRESHOLD || BITS_TO_IGNORE.includes(bits)){
                    return;
                }
                runQueue({
                    type: 'twitchCheer',
                    data: {
                        userName: displayName,
                        amount: bits,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'Raid') {
                const {from_broadcaster_user_name, viewers} = wsdata.data;
                runQueue({
                    type: 'twitchRaid',
                    data: {
                        userName: from_broadcaster_user_name,
                        amount: viewers,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'Sub') {
                const {userName} = wsdata.data;
                runQueue({
                    type: 'twitchSub',
                    data: {
                        userName,
                        amount: 1,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'ReSub') {
                const {userName, cumulativeMonths} = wsdata.data;
                runQueue({
                    type: 'twitchSub',
                    data: {
                        userName,
                        amount: cumulativeMonths,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'GiftSub') {
                const {displayName, recipientDisplayName} = wsdata.data;
                runQueue({
                    type: 'twitchGiftSub',
                    data: {
                        userName: recipientDisplayName,
                        sender: displayName,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'GiftBomb') {
                const {displayName, gifts} = wsdata.data;
                console.log(user_name);
                runQueue({
                    type: 'twitchGiftBomb',
                    data: {
                        userName: displayName,
                        amount: gifts,
                    }
                });

                return;
            }

            console.warn(['Twitch Event not implemented', event]);
            return;
        }
        // everything beyond here should be youtube
        // if (wsdata.event.type === 'NewSponsor') {
        //     const {user_name} = wsdata.data;
        //     console.log(user_name);
        //     runQueue({
        //         type: 'twitchFollower',
        //         data: {
        //             userName: user_name,
        //         }
        //     });
        // }
        if (wsdata.event.type === 'NewSubscriber') {
            const {user} = wsdata.data;
            runQueue({
                type: 'youtubeSubscriber',
                data: {
                    userName: user,
                }
            });
        }
        // if (wsdata.event.type === 'SuperChat') {
        //     const {user_name} = wsdata.data;
        //     console.log(user_name);
        //     runQueue({
        //         type: 'twitchFollower',
        //         data: {
        //             userName: user_name,
        //         }
        //     });
        // }
        console.warn(['YouTube Event not implemented', event]);
    }
}