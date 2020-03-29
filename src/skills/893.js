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

// skill id: 893
/** 
Attacks an enemy 4 times, decreasing the Attack Bar by 30% with a 75% chance for each attack. This attack is guaranteed a stun for 1 turn if the enemy's Attack Bar is depleted. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ATB reduced to 0%
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(893, spec.meta, multistep(spec.action))
}
