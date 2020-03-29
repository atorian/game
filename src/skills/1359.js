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

// skill id: 1359
/** 
Attacks the enemy and decreases its Attack Power for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(1359, spec.meta, multistep(spec.action))
}
