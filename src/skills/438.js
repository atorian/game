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

// skill id: 438
/** 
Attacks an enemy with fierce kicks to weaken the enemy's Defense for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.atk + -20,
                ),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 50,
            cooldown: 0,
        },
    }
    return new GenericSkill(438, spec.meta, multistep(spec.action))
}
