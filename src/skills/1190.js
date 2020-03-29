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

// skill id: 1190
/** 
Attacks the enemy with the power of Yin and Yang and puts the enemy to sleep for 2 turns with a 20% chance. The damage increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.6 + attacker.maxHp * 0.09,
                ),
                debuff(roll, "sleep", 2, 20),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 5,
            cooldown: 0,
        },
    }
    return new GenericSkill(1190, spec.meta, multistep(spec.action))
}
