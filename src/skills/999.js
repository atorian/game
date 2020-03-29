// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 999
/** 
Revives a dead ally with 40% HP and grants immunity for 1 turn. If this skill is used on yourself, you receive a Soul Protection for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If targeted on self
        action: [
            step(
                targetAlly,
                heal((self, target) => target.maxHp * 0.4),
                buff((self, target) => target.buf("soul_protect", 3)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("soul_protect", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(999, spec.meta, multistep(spec.action))
}
