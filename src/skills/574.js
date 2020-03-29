// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 574
/** 
Attacks the attacker with a critical hit to inflict damage that's proportionate to your Attack Power and Stuns the target for 1 turn with a 40% chance when attacked with a critical hit. Additionally, your Attack Bar increases by 30%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When receiving critical hit
        // fixme: When receiving critical hit
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.5),
                debuff(roll, "stun", 1, null),
            ),
            step(targetSelf, atbIncrease(30)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(574, spec.meta, multistep(spec.action))
}
