// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1216
/** 
Sacrifices 10% of an ally target's HP to grant a turn instantly to the target. Decreases the skill cooldown of all allies by 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1216, spec.meta, multistep(spec.action))
}
