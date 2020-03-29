// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1199
/** 
Revives all dead allies with 30% HP and casts Soul Protection upon all allies that are alive for 3 turns. If the ally with Soul Protection dies, that ally will be revived automatically with 30% HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("soul_protect", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(1199, spec.meta, multistep(spec.action))
}
