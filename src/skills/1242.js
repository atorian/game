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

// skill id: 1242
/** 
Attacks the enemy to deal damage proportionate to the MAX HP and Silences the enemy for 2 turns. The enemy under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 4.4 + target.maxHp * 0.11,
                ),
                debuff(roll, "silence", 2, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1242, spec.meta, multistep(spec.action))
}
