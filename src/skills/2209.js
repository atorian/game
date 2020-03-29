// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2209
/** 
Attacks with giant claws to weaken the enemy's defense for 2 turns with a 70% chance and attacks consecutively with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "def_break", 2, 70),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2209, spec.meta, multistep(spec.action))
}
