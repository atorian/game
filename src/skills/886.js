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

// skill id: 886
/** 
Attacks the enemy 3 times in a row and absorbs the Attack Bar by 20% with each strike. Inflicts Continuous Damage for 2 turns if you attack with a critical hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 2, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 2, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 2, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(886, spec.meta, multistep(spec.action))
}
