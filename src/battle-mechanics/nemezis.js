import {Battle} from "../battle";
import type {Contestant} from "../battle";

export default class Nemezis {
    constructor(policy) {
        this.policy = policy;
    }

    subscribe(battle: Battle) {
        battle.dispatcher.on('hit', ({damage, target}) => {
            // todo: calculate real value 4% atb for 7% hp lost
            const unit: Contestant = battle.units[target];
            const num_rune_sets = unit.rune_sets.filter(set => set === 'nemezis').length;

            if (num_rune_sets > 0) {
                const chunk = Math.floor(unit.max_hp / 7);
                const procs = Math.floor(damage / chunk);

                if (procs > 0) {
                    battle.dispatcher.emit('nemezis', {
                        unit: unit.id,
                        value: procs * 4 * num_rune_sets,
                    })
                }
            }
        });
    }
}
