
import Battle, * as events from '../battle';

function serializeEvent(event) {
    return {
        ...event,
        type: event.constructor.name,
    }
}

console.log(Object.keys(events));


function deserialize({type, ...data}) {
    if (type in events) {
        return Object.assign(
            Object.create(events[type].prototype),
            data,
        ) ;
    }

    throw new Error(`Unknown battle event "${type}" with payload: ${JSON.stringify(data)}`);
}


export default class LocalStorageBattles {

    constructor() {
        this.storage = window.localStorage;
    }

    persist(battle) {
        const serializedEvents = this.storage.getItem(battle.id);
        let oldEvents = [];
        if (serializedEvents) {
            oldEvents = JSON.parse(serializedEvents);
        }

        this.storage.setItem(battle.id, JSON.stringify([
            ...oldEvents,
            ...battle.events.map(serializeEvent)
        ]));
    }

    find(id: string) {
        let battle = new Battle(id);
        let serializedEvents = this.storage.getItem(id);
        if (serializedEvents) {
            for (let event of JSON.parse(serializedEvents)) {
                battle.applyEvent(deserialize(event));
            }
            return battle;
        }
        throw new Error('Battle Not Found');
    }
}
