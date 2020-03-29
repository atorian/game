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

// skill id: 415
/** 
Attacks the enemy with a body slam and weakens their Attack Power and Defense for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.1),
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "def_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(415, spec.meta, multistep(spec.action))
}
