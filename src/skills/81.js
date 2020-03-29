// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 81
/** 
Fills up an ally target's Attack Bar and strengthens their Attack Power for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("atk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(81, spec.meta, multistep(spec.action))
}
