// @flow
import type { Ability } from "../index"
import { step, targetEnemies, multistep, GenericSkill } from "../skill"

// skill id: 1617
/** 
Revives with 50% HP when you're inflicted with fatal damage and falls under the Magic Power Explosion state for 2 turns. The Magic Power Explosion state will increase the damage inflicted to the enemies by 30%, but you'll be uncontrollable and die when the effect ends. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 71
        action: [step(targetEnemies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 10,
        },
    }
    return new GenericSkill(1617, spec.meta, multistep(spec.action))
}
