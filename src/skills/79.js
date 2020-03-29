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

// skill id: 79
/** 
Attacks the enemy with a Fire ball and inflicts Continuous Damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.8 + attacker.atk + 50,
                ),
                debuff(roll, "dot", 3, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(79, spec.meta, multistep(spec.action))
}
