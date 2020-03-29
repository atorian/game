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

// skill id: 45
/** 
Attacks the enemy with sharp, icy claws. Inflicts Continuous Damage for 2 turns if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.5),
                debuff(roll, "dot", 310, null),
            ),
        ],
        meta: {
            dmg: 50,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(45, spec.meta, multistep(spec.action))
}
