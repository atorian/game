// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1709
/** 
Creates a shield that's 30% of your MAX HP for 3 turns and creates a shield that's 20% of your MAX HP on all other allies for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            shield: 0.2,
        },
    }
    return new GenericSkill(1709, spec.meta, multistep(spec.action))
}
