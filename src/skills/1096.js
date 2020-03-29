// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1096
/** 
The attack speed of all enemies and allies is limited to your attack speed. This effect does not affect enemies with the same skill or Boss Monsters. Decreases the enemy's Attack Bar by 15% with an attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies, atbDecrease(roll, undefined))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1096, spec.meta, multistep(spec.action))
}
