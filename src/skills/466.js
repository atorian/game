// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 466
/** 
Increases the Attack Power and Attack Speed of all allies for 2 turns, and becomes invincible for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(466, spec.meta, multistep(spec.action))
}
