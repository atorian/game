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

// skill id: 1248
/** 
Attacks an enemy and looks for its weakness. This attack decreases the enemy's Defense for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1248, spec.meta, multistep(spec.action))
}
