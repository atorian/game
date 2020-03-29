// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    buff,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1001
/** 
Removes up to 2 harmful effects on the ally target and makes the target Invincible for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("invincibility", 3)),
                cleanse(2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1001, spec.meta, multistep(spec.action))
}
