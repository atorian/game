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

// skill id: 528
/** 
Attacks the enemy 3 times and disturbs its HP recovery for 2 turns with an 80% chance with each attack. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.def * 2.4,
                ),
                debuff(roll, "def_break", 2, 80),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.def * 2.4,
                ),
                debuff(roll, "def_break", 2, 80),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.def * 2.4,
                ),
                debuff(roll, "def_break", 2, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(528, spec.meta, multistep(spec.action))
}
