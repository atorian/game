// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1396
/** 
Increases the Attack Speed and Critical Rate of all allies for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("spd", 2)),
                buff((self, target) => target.buf("cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1396, spec.meta, multistep(spec.action))
}
