// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 284
/** 
Recovers the HP of all allies with an energizing roar and increases the defense for 2 turns. The recovery amount is proportionate to my MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("def", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(284, spec.meta, multistep(spec.action))
}
