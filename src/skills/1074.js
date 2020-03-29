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

// skill id: 1074
/** 
Burns enemies with a Fire shower and inflicts Continuous Damage for 3 turns with a 25% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.8),
                debuff(roll, "dot", 3, 25),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(1074, spec.meta, multistep(spec.action))
}
