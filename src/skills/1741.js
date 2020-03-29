// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1741
/** 
Creates a shield that absorbs damage proportionate to your level on all allies and increases their Defense for 2 turns. 
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
    return new GenericSkill(1741, spec.meta, multistep(spec.action))
}
