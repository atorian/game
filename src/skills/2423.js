// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2423
/** 
Attacks the enemy to decrease the Attack Speed for 2 turns with a 30% chance. The faster your Attack Speed compared to the enemy's, the greater damage you can inflict. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                // fixme: atkAndRelativeSpdDmg
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(2423, spec.meta, multistep(spec.action))
}
