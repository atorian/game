// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1231
/** 
Removes all harmful effects on all allies and grants them Immunity and Invincibility for 1 turn. Increases the Immunity effect up to 3 turns proportionate to the no. of harmful effects removed from each ally. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1231, spec.meta, multistep(spec.action))
}
