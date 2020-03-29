// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1468
/** 
Your Attack Bar increases by 20% whenever you are attacked. Your attacks will inflict additional damage that is proportionate to your Defense whenever you attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.6),
            ),
            step(targetSelf, atbIncrease(20)),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1468, spec.meta, multistep(spec.action))
}
