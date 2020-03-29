// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1276
/** 
Grants immunity on all allies for 2 turns with holy powers. In addition, the target ally will become invincible for 2 turns, and all other allies will be granted with a shield that's proportionate to your level for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("immunity", 2)),
                buff((self, target) => target.buf("invincibility", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1276, spec.meta, multistep(spec.action))
}
