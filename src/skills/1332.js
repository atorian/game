// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1332
/** 
Deals damage proportionate to your MAX HP to an enemy target and recovers 50% of the damage dealt as HP. The damage increases as the enemy's HP becomes lower. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1332, spec.meta, multistep(spec.action))
}
