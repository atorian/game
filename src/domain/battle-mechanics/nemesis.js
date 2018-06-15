import {Battle} from "../battle";
import {BattleMechanics} from "./index";

export default class Nemesis implements BattleMechanics {
    constructor(policy) {
        this.policy = policy;
    }

    subscribe(battle: Battle) {
        battle.dispatcher.on('hit', ({damage, target}) => {
            // todo: calculate real value 4% atb for 7% hp lost
            const unit = battle.units[target];
            const num_rune_sets = unit.rune_sets.filter(set => set === 'nemesis').length;

            if (num_rune_sets > 0) {
                const chunk = Math.floor(unit.max_hp / 7);
                const procs = Math.floor(damage / chunk);

                if (procs > 0) {
                    battle.dispatcher.emit('nemesis', {
                        unit: unit.id,
                        value: procs * 4 * num_rune_sets,
                    })
                }
            }
        });
    }
}
