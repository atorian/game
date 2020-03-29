// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 844
/** 
Attacks all enemies to decrease the Attack Bar by 50% each and decrease the Defense for 2 turns. This attack lands as a Crushing Hit, regardless of the enemy's attribute. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                debuff(roll, "def_break", 2, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(844, spec.meta, multistep(spec.action))
}
