// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1243
/** 
Revives another ally with 30% HP when inflicted with fatal damage that can lead to death and increases the target's Attack Power for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("atk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(1243, spec.meta, multistep(spec.action))
}
