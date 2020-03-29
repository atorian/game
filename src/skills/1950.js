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

// skill id: 1950
/** 
Attacks the enemy 2 times to decrease the Defense with the first attack and decreases the Attack Power afterwards with a 50% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: First hit only
        // fixme: Second hit only
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "def_break", 1, 50),
                debuff(roll, "atk_break", 1, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "def_break", 1, 50),
                debuff(roll, "atk_break", 1, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 2,
        },
    }
    return new GenericSkill(1950, spec.meta, multistep(spec.action))
}
