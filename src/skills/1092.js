// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1092
/** 
Channels burning rage to inflict damage that ignores all damage reduction effects to the enemy. The damage increases according to the number of dead allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: ATK,Living Ally %
        action: [step(targetAllies)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1092, spec.meta, multistep(spec.action))
}
