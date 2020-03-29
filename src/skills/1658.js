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

// skill id: 1658
/** 
Attacks the enemy 2 times to disturb the HP recovery for 2 turns with a 30% chance each. The damage increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.5 + attacker.maxHp * 0.1,
                ),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.5 + attacker.maxHp * 0.1,
                ),
                debuff(roll, "heal_block", 2, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1658, spec.meta, multistep(spec.action))
}
