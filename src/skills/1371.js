// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1371
/** 
Silences all enemies and puts them in Oblivion state for 2 turns. Passive skills aren't activated in Oblivion state and enemies under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, debuff(roll, "oblivious", 2, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1371, spec.meta, multistep(spec.action))
}
