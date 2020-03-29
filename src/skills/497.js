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

// skill id: 497
/** 
Attacks with giant claws to weaken the enemy's defense with a 50% chance and attacks consecutively with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "def_break", 2, 50),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(497, spec.meta, multistep(spec.action))
}
