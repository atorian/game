// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 377
/** 
Attacks the enemy and recovers the HP by 30% of the damage dealt. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(377, spec.meta, multistep(spec.action))
}
