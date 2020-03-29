// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1256
/** 
Decreases the damage that all other ally Monsters receive by 15%, and decreases the recovery amount of every Monster on the battle field by 50%. This effect doesn't accumulate with other similar effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1256, spec.meta, multistep(spec.action))
}
