// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1197
/** 
Grants immunity to all allies that lasts for 3 turns and creates a shield equal to 15% of my HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("immunity", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            shield: 0.2,
        },
    }
    return new GenericSkill(1197, spec.meta, multistep(spec.action))
}
