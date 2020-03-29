// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 649
/** 
Stuns the enemy with the highest Attack Bar for 1 turn, removes the harmful effects on you, and recovers 15% HP. Also your Attack Speed will be increased and you will recover 15% HP per turn for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(649, spec.meta, multistep(spec.action))
}
