import {CHEER_THRESHOLD, WEBSOCKET_URL, BITS_TO_IGNORE} from "./constants.mjs";
import {runQueue} from "./queueRunner.mjs";

let socket;

export function initializeConnections() {
    // Streamer.Bot websocket connection
    console.debug('Streamer.Bot is enabled');

    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
        let subscribeEvents = {
            General: ['Custom']
        };
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
        if (!['Twitch', 'YouTube', 'General'].includes(wsdata.event.source)) {
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
                const {user} = wsdata.data;
                runQueue({
                    type: 'twitchSub',
                    data: {
                        userName: user.name,
                        amount: 1,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'ReSub') {
                const {user, cumulativeMonths} = wsdata.data;
                runQueue({
                    type: 'twitchSub',
                    data: {
                        userName: user.name,
                        amount: cumulativeMonths,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'GiftSub') {
                const {user, recipient} = wsdata.data;
                runQueue({
                    type: 'twitchGiftSub',
                    data: {
                        userName: recipient.name,
                        sender: user.name,
                    }
                });

                return;
            }
            if (wsdata.event.type === 'GiftBomb') {
                const {user, gifts} = wsdata.data;
                runQueue({
                    type: 'twitchGiftBomb',
                    data: {
                        userName: user.name,
                        amount: gifts,
                    }
                });

                return;
            }

            console.warn(['Twitch Event not implemented', event]);
            return;
        }
        if (wsdata.event.source === 'General') {
            if (wsdata.event.type === 'Custom') {
                if(wsdata.data.event === 'sammiYoutubeNotification'){
                    const {name} = wsdata.data;
                    runQueue({
                        type: 'youtubeSubscriber',
                        data: {
                            userName: name,
                        }
                    });
                }

            }
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