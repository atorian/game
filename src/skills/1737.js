// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1737
/** 
Recovers an ally's HP by 20%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Target MAX HP
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(1737, spec.meta, multistep(spec.action))
}
