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

// skill id: 533
/** 
Attacks the enemy 2 times and weakens the enemy's Defense and inflicts continuous damage for 2 turns with a 15% chance with each attack. The Attack Power increases according to Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.def * 1.3,
                ),
                debuff(roll, "def_break", 2, 15),
                debuff(roll, "dot", 2, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.def * 1.3,
                ),
                debuff(roll, "def_break", 2, 15),
                debuff(roll, "dot", 2, 15),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(533, spec.meta, multistep(spec.action))
}
