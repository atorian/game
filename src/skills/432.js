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

// skill id: 432
/** 
Creates a living hell for the enemies and inflicts Continuous Damage and disturbs the enemy's HP recovery for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.2),
                debuff(roll, "dot", 3, 100),
                debuff(roll, "heal_block", 3, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(432, spec.meta, multistep(spec.action))
}
