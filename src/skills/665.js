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

// skill id: 665
/** 
Attacks the enemy with an axe to inflict 2 Continuous Damage effects for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "dot", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(665, spec.meta, multistep(spec.action))
}
