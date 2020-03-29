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

// skill id: 539
/** 
Attacks all enemies dealing damage proportionate to your Defense and inflicts Continuous Damage for 3 turns with a 50% chance. The damage of this skill will increase by 30% for each harmful effect on the enemy.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.def * 2.7 + attacker.debuff * 0.3,
                ),
                debuff(roll, "dot", 3, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(539, spec.meta, multistep(spec.action))
}
