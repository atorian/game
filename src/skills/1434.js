// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1434
/** 
Increases the Critical Rate of all allies and decreases their chances of receiving a Critical Hit for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("cr", 2)),
                buff((self, target) => target.buf("anti_cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1434, spec.meta, multistep(spec.action))
}
