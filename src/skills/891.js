// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 891
/** 
Gets an extra turn with a 20% chance when your turn is over. Increases the effect activation rate by 20% each if the effect doesn't get activated. The increased rate will reset when the effect is activated. [Automatic Effect] 
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
    return new GenericSkill(891, spec.meta, multistep(spec.action))
}
