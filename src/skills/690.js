// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 690
/** 
Increases the Attack Power and critical rate of all allies for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 2)),
                buff((self, target) => target.buf("cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(690, spec.meta, multistep(spec.action))
}
