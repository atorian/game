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

// skill id: 2318
/** 
Attacks the enemy with claws and disturbs the enemy's HP recovery for 1 turn. The damage of this attack increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.5 + attacker.maxHp * 0.16,
                ),
                debuff(roll, "heal_block", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2318, spec.meta, multistep(spec.action))
}
