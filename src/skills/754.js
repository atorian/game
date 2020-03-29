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

// skill id: 754
/** 
Summons the souls of the dead to attack the enemy 2 - 3 times. Each attack has a 40% chance to decrease the enemy's Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "def_break", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "def_break", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "def_break", 2, 40),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(754, spec.meta, multistep(spec.action))
}
