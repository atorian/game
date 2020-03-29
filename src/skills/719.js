// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 719
/** 
Summons a wall of fire and inflicts Continuous Damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(719, spec.meta, multistep(spec.action))
}
