import _ from 'lodash';
import {Battle} from "../battle";
import {BattleMechanics} from "./index";

export function vioPolicy() {
    return _.random(1, 100) <= 22;
}

export class Violent implements BattleMechanics {
    constructor(policy) {
        this.proc = policy;
    }

    subscribe(battle: Battle) {
        battle.dispatcher.on('skill_used', ({unit_id}) => {
            const has_vio = battle.unit.rune_sets.includes('violent');
            if (!battle.reacting && has_vio && this.proc()) {
                battle.dispatcher.emit('additional_turn', {
                    unit_id: unit_id,
                })
            }
        });
    }
}

export default new Violent(vioPolicy);
