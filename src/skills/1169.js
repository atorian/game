// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1169
/** 
Removes the harmful effect on all allies, makes them invincible for 1 turn and recovers their HP by 15% each for 3 turns. 
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
    return new GenericSkill(1169, spec.meta, multistep(spec.action))
}
