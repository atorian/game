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

// skill id: 1108
/** 
Performs a ruthless charge, attacking all enemies 3 times. Each attack has a 35% chance to inflict Continuous Damage for 1 turn and the skill will deal 50% increased damage to enemies under Continuous Damage Effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.3 + attacker.debuff * 0.5,
                ),
                debuff(roll, "dot", 1, 35),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.3 + attacker.debuff * 0.5,
                ),
                debuff(roll, "dot", 1, 35),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.3 + attacker.debuff * 0.5,
                ),
                debuff(roll, "dot", 1, 35),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1108, spec.meta, multistep(spec.action))
}
