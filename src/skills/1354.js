// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1354
/** 
Increases the Defense and Critical Rate of all allies for 2 turns, and fully fills up the target ally's Attack Bar. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                debuff(roll, "def_break", 2, 100),
                buff((self, target) => target.buf("cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1354, spec.meta, multistep(spec.action))
}
