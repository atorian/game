// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1429
/** 
Fills up an ally's Attack Bar to the MAX and increases the target's Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1429, spec.meta, multistep(spec.action))
}
