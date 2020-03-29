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

// skill id: 2120
/** 
Attacks random enemies 8 times. Each attack has a 50% chance to weaken their Defense for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 50, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(2120, spec.meta, multistep(spec.action))
}
