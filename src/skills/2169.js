// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 2169
/** 
Increases the Attack Power and Defense of all allies for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 3)),
                buff((self, target) => target.buf("def", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2169, spec.meta, multistep(spec.action))
}
