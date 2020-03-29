// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    buff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1046
/** 
Escorts the ally target for 3 turns and instantly recovers your turn. Receives half of the damage inflicted on the escorted target while making the damage dealt to the escorted target to 0 and counterattacks the enemy target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("defend", 3)),
                buff((self, target) => target.buf("counterAtk", 3)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 3)),
                additionalTurn(roll, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1046, spec.meta, multistep(spec.action))
}
