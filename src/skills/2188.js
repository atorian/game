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

// skill id: 2188
/** 
Counterattacks with a 50% chance when you receive damage, and revives with 30% of HP at the last dying breath using the power of unbreakable will. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(2188, spec.meta, multistep(spec.action))
}
