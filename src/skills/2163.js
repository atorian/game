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

// skill id: 2163
/** 
Attacks the enemy with a burning flame, inflicting Continuous Damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.6),
                debuff(roll, "dot", 3, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(2163, spec.meta, multistep(spec.action))
}
