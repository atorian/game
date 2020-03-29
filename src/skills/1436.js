// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1436
/** 
Becomes best friends with an ally with the lowest HP when the battle begins. Grants one of Increase ATK/Recovery/Endure effects according to the friend's HP status for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("atk", 1)),
                buff((self, target) => target.buf("endure", 1)),
                buff((self, target) => target.buf("hot", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1436, spec.meta, multistep(spec.action))
}
