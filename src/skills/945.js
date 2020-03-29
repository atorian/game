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

// skill id: 945
/** 
Attacks without waking up the enemy that's under Sleep. Attacks all enemies to deal damage proportionate to their MAX HP and disturbs their HP recovery for 2 turns with a 75% chance. If the enemy is under Sleep, this attack will deal 50% more damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 4 + target.maxHp * 0.08,
                ),
                debuff(roll, "heal_block", 2, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(945, spec.meta, multistep(spec.action))
}
