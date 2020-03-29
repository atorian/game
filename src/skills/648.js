// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 648
/** 
If an ally receives an attack that kills them, that death will be prevented and 30% of your MAX HP will be transferred to that ally. This skill will not activate if your HP is below 30%. [Automatic Effect]  
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
    return new GenericSkill(648, spec.meta, multistep(spec.action))
}
