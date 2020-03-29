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

// skill id: 1119
/** 
Attacks the enemy 3 times with magic and weakens the Defense for 2 turns with a 50% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Element advantage behavior detected: 1119.
        // fixme: Provided by passive
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(1119, spec.meta, multistep(spec.action))
}
