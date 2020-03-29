// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 1113
/** 
An ally is revived with 30% HP and is able to use all skills. The revived ally is also granted 1 turn of invincibility. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => target.maxHp * 0.3),
                buff((self, target) => target.buf("invincibility", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(1113, spec.meta, multistep(spec.action))
}
