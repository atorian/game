// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 581
/** 
Attacks with an axe and decreases the target's Attack Bar to 0. Additionally, your Attack Bar will be increased proportionate to the reduced Attack Bar if you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.2),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(581, spec.meta, multistep(spec.action))
}
