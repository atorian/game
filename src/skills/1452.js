// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1452
/** 
Decreases the chances of the allies being granted with harmful effects by 30% and increases the duration of the harmful effects that the allies, excluding those that are under inability effects, grant on the enemies by 1 turn each with the power of a piercing gaze. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 60
        // fixme: Increase debuff duration applied to enemies
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1452, spec.meta, multistep(spec.action))
}
