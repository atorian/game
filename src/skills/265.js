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

// skill id: 265
/** 
Fires two magical arrows, with each hit having a 60% chance to do Continuous Damage to the enemy for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "dot", 3, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "dot", 3, 40),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 20,
            cooldown: 2,
        },
    }
    return new GenericSkill(265, spec.meta, multistep(spec.action))
}
