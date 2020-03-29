// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2128
/** 
Attacks the enemy with a cannon gun and decreases the Attack Bar to 0. Afterwards, inflicts damage on all enemies and stuns them for 1 turn with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 30),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 30),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(2128, spec.meta, multistep(spec.action))
}
