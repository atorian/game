// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1018
/** 
At the moment of death, you regain HP by absorbing 10% HP from all other allies. HP can't be absorbed from allies that are at 30% HP or lower. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1018, spec.meta, multistep(spec.action))
}
