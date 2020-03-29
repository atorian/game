// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    strip,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2331
/** 
Violently attacks the enemy 4 times to inflict damage proportionate to my MAX HP and removes a beneficial effect with each attack. If you successfully remove a beneficial effect, the damage inflicted by the remaining attacks will be increased by 20%, and the cooldown time will reset if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy, strip(roll, 10, 100)),
            step(targetEnemy, strip(roll, 10, 100)),
            step(targetEnemy, strip(roll, 10, 100)),
            step(targetEnemy, strip(roll, 10, 100)),
            step(targetSelf),
        ],
        meta: {
            dmg: 10,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2331, spec.meta, multistep(spec.action))
}
