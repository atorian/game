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

// skill id: 2158
/** 
Attacks the enemy with an Energy ball. The attack has a 75% chance of increasing the enemy's chance to land a Glancing Hit and inflicting Continuous Damage for 2 turns each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.4),
                debuff(roll, "glancing", 2, 75),
                debuff(roll, "dot", 2, 75),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2158, spec.meta, multistep(spec.action))
}
