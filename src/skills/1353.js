// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1353
/** 
Increases the Attack Power and Critical Rate of all allies for 2 turns, and makes the designated target Invincible for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("cr", 2)),
                buff((self, target) => target.buf("atk", 2)),
                buff((self, target) => target.buf("invincibility", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1353, spec.meta, multistep(spec.action))
}
