// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1933
/** 
Creates a shield that's proportionate to 20% of your HP on all allies for 2 turns when an ally is under inability effects. All of your harmful effects will be removed and you'll instantly recover a turn afterwards. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When under inability effect
        action: [step(targetAlly), step(targetSelf, additionalTurn(roll, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1933, spec.meta, multistep(spec.action))
}
