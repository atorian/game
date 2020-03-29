// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 971
/** 
Attacks all enemies with a twister to inflict damage that's proportionate to your MAX HP and recovers the HP of all allies by 25% each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(971, spec.meta, multistep(spec.action))
}
