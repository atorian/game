// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1549
/** 
Shoots 3 projectiles, with each projectile having a 30% chance to slow the Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.34),
                debuff(roll, "slow", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.34),
                debuff(roll, "slow", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.34),
                debuff(roll, "slow", 2, 30),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1549, spec.meta, multistep(spec.action))
}
