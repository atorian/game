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

// skill id: 273
/** 
Fires two magical arrows, with each hit having a 40% chance to disturb the enemy's HP recovery for 2 turns. The enemy can't be revived if the enemy is killed with this skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "heal_block", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "heal_block", 2, 40),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(273, spec.meta, multistep(spec.action))
}
