// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 1059
/** 
Gains increased Attack Power and Immunity against harmful effects for 3 turns. Instantly recovers a turn when used. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 3)),
                buff((self, target) => target.buf("immunity", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1059, spec.meta, multistep(spec.action))
}
