

export function is_crit(events) {
    const last_hit = events.filter(e => e.name === 'hit').pop();
    return last_hit && last_hit.payload.type === 'critical';
}

class Condition {
    constructor(strategy) {
        this.strategy = strategy;
    }

    isOk(events) {
        return this.strategy(events);
    }
}

export default {
    is_crit: new Condition(is_crit),
}
