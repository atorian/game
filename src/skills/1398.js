// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1398
/** 
Steals a beneficial effect from the enemy target when landing an attack. Your Attack Speed increases according to the number of beneficial effects currently on you. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy, strip(roll, 10, 100)),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1398, spec.meta, multistep(spec.action))
}
