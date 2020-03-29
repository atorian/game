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

// skill id: 2133
/** 
Attacks all enemies with a cyclone 2 times. Each attack has a 40% chance of increasing the enemy's chance of landing a Glancing Hit for 2 turns. The damage is proportionate to the enemy's MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 1.3 + target.maxHp * 0.04,
                ),
                debuff(roll, "glancing", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 1.3 + target.maxHp * 0.04,
                ),
                debuff(roll, "glancing", 2, 40),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(2133, spec.meta, multistep(spec.action))
}
