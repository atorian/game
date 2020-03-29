// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1306
/** 
The attacks performed on your turns will generate a shield that lasts for 1 turn. The shield is equivalent to 50% of the damage dealt. Also, increases your Critical Rate by 30% and deals additional damage that's proportionate to the shield amount granted on yourself with every attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1306, spec.meta, multistep(spec.action))
}
