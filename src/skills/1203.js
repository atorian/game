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

// skill id: 1203
/** 
Attacks the enemy to inflict damage and weakens the Defense for 2 turns with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.1),
                debuff(roll, "def_break", 2, 30),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1203, spec.meta, multistep(spec.action))
}
