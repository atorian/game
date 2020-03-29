// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 979
/** 
Creates a shield that's proportionate to 20% of your HP on all allies for 3 turns and decreases the chance of being attacked with a critical hit of the allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("anti_cr", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(979, spec.meta, multistep(spec.action))
}
