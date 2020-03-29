// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 318
/** 
Attacks the enemy 3 times with arrows of light. The faster your Attack Speed compared to the enemy's, the greater damage you can inflict. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: ATK,SPD,Target SPD
        action: [step(targetEnemy), step(targetEnemy), step(targetEnemy)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(318, spec.meta, multistep(spec.action))
}
