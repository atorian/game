// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 572
/** 
Gains 25% Critical Chance and deals 20% more damage for every harmful effect that's on the targeted enemy. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Per debuff on target
        // fixme: Per debuff on target
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 25)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(572, spec.meta, multistep(spec.action))
}
