// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 715
/** 
Mounts a bomb on all enemies which detonates after 2 turns. This skill receives 50% additional Accuracy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, debuff(roll, "bomb", 2, 100))],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(715, spec.meta, multistep(spec.action))
}
