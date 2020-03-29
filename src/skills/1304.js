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

// skill id: 1304
/** 
Swiftly attacks the enemy 3 times with each attack inflicting Continuous Damage for 1 turn. If this attack lands as a Critical Hit, it will disturb the target's HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
                debuff(roll, "dot", 1, 100),
                debuff(roll, "heal_block", 2, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
                debuff(roll, "dot", 1, 100),
                debuff(roll, "heal_block", 2, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
                debuff(roll, "dot", 1, 100),
                debuff(roll, "heal_block", 2, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1304, spec.meta, multistep(spec.action))
}
