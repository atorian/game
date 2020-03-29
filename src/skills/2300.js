// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2300
/** 
If you kill an enemy with your attack, you will revive one of dead allies with HP that's the same amount of the damage you dealt on the enemy target. If other ally dies when you are dead, you will be revived with little HP and 100% Attack Bar. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2300, spec.meta, multistep(spec.action))
}
