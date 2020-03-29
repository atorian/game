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

// skill id: 685
/** 
Attacks all enemies with giant orbs, decreasing their Defense for 1 turn. This attack lands as a Crushing Hit, regardless of the enemy's attribute. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Element advantage behavior detected: 685.
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "def_break", 1, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(685, spec.meta, multistep(spec.action))
}
