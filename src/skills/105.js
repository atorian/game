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

// skill id: 105
/** 
Calls out some violent friends to gang up on one enemy to attack 4 times and weakens the defense for 2 turns with a 30% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(105, spec.meta, multistep(spec.action))
}
