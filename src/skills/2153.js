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

// skill id: 2153
/** 
Inflicts damage on the enemy with a curse to increase the enemy's chance of dealing a Glancing Hit and silence the enemy for 3 turns each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8.2),
                debuff(roll, "glancing", 3, 100),
                debuff(roll, "silence", 3, 100),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2153, spec.meta, multistep(spec.action))
}
