// @flow
import type { Ability } from "../index"
import {
    step,
    targetSelf,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 541
/** 
Decreases the chances of being attacked with a critical hit by 50% and decreases the attacker's attack speed for 1 turn with a 50% chance when attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetSelf,
                debuff(roll, "slow", null, 50),
                buff((self, target) => target.buf("anti_cr", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(541, spec.meta, multistep(spec.action))
}
