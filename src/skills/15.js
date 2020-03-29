// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 15
/** 
Acquires 2x the EXP compared to a normal Angelmon when used for Power-ups. Awaken to get even more EXP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(15, spec.meta, multistep(spec.action))
}
