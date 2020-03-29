// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1195
/** 
Attacks the enemy with the might of the mountains to inflict damage that's proportionate to your MAX HP and recovers the HP of all allies by 15% of your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1195, spec.meta, multistep(spec.action))
}
