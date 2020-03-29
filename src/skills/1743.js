// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1743
/** 
Revives with 50% HP when you're inflicted with fatal damage, and resets the skill cooldown time of all skills and falls under the Magic Power Explosion state for 2 turns. You'll be uncontrollable under the Magic Power Explosion state and be defeated when the effect ends. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 71
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 10,
        },
    }
    return new GenericSkill(1743, spec.meta, multistep(spec.action))
}
