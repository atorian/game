// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1460
/** 
Removes the harmful effects casted on yourself and counterattacks for 2 turns when attacked. Recovers 15% of the HP of all allies in each turn for the next 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("counterAtk", 2)),
                buff((self, target) => target.buf("hot", 2)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1460, spec.meta, multistep(spec.action))
}
