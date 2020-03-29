// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2150
/** 
Shoots a flurry of arrows, attacking all enemies 4 - 6 times. Each attack has a 20% chance to remove a beneficial effect and reduce their Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 20),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(2150, spec.meta, multistep(spec.action))
}
