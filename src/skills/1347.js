// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1347
/** 
Increases the Defense of all allies for 2 turns, and decreases the chance of them receiving Critical Hits. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("def", 2)),
                buff((self, target) => target.buf("anti_cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1347, spec.meta, multistep(spec.action))
}
