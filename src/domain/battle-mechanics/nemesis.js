import {Battle} from "../battle";
import {BattleMechanics} from "./index";

export default class Nemesis implements BattleMechanics {
    subscribe(battle: Battle) {
        battle.on('hit', ({damage, target}) => {
            // todo: calculate real value 4% atb for 7% hp lost
            const unit = battle.units[target];
            const num_rune_sets = unit.rune_sets.filter(set => set === 'nemesis').length;

            if (num_rune_sets > 0) {
                const chunk = Math.floor(unit.max_hp / 7);
                const procs = Math.floor(damage / chunk);

                if (procs > 0) {
                    battle.emit('atb_increase', {
                        target: unit.id,
                        value: procs * 4 * num_rune_sets,
                    })
                }
            }
        });
    }
}
