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

// skill id: 592
/** 
Summons crows to attack the enemy and inflict Continuous Damage for 1 turn with a 70% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.6),
                debuff(roll, "dot", 1, 70),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(592, spec.meta, multistep(spec.action))
}
