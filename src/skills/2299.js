// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 2299
/** 
The Attack Bar of all allies will be increased by the proportion to the damage dealt, and the damage you deal on enemies will be increased by 50% at the most whenever all enemies and allies on the battlefield receive damage. [Automatic Effect] 
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
    return new GenericSkill(2299, spec.meta, multistep(spec.action))
}
