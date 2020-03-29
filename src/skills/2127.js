// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 2127
/** 
Attacks all enemies with a cannon gun. The damage increases in proportion to the number of allies alive. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Alive Allies %,ATK
        action: [step(targetAllies)],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2127, spec.meta, multistep(spec.action))
}
