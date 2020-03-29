// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    cleanse,
    targetSelf,
    heal,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1095
/** 
Gains immunity against HP recovery disturbance effects, and removes 1 harmful effect except inability effect and recovers 15% HP at the end of your turn. Also, the damage you deal will be increased according to your current HP. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy, cleanse(1)),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.15),
                cleanse(1),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1095, spec.meta, multistep(spec.action))
}
