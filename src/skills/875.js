// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 875
/** 
Unleashes a battle cry that increases the Attack Power of all allies for 2 turns, and decreases the defense of the enemy for 2 turns with a 75% chance at the same time. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(875, spec.meta, multistep(spec.action))
}
