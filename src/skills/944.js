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

// skill id: 944
/** 
Attacks without waking up the enemy that's under Sleep. Reduces the Attack Speed of all enemies for 2 turns and increases the enemy's chances of landing a Glancing Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "slow", 2, 100),
                debuff(roll, "glancing", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(944, spec.meta, multistep(spec.action))
}
