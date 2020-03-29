// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 975
/** 
Sacrifices yourself at the moment of death to remove all harmful effects and fully recover the HP of all allies. Additionally, your attack will decrease the enemy's Attack Bar by 15%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies, atbDecrease(roll, undefined))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 10,
        },
    }
    return new GenericSkill(975, spec.meta, multistep(spec.action))
}
