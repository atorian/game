// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 70
/** 
Removes the ally's harmful effect and makes the ally invincible for 2 turns.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("invincibility", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(70, spec.meta, multistep(spec.action))
}
