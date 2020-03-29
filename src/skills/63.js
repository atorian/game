// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 63
/** 
Shoots a flurry of arrows, attacking all enemies 4 - 6 times. Each attack has a 20% chance to reduce their Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.85),
                debuff(roll, "slow", 2, 20),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(63, spec.meta, multistep(spec.action))
}
