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

// skill id: 91
/** 
Performs a ruthless combo, kicking the enemy 2 times. Each attack has a 50% chance of decreasing the enemy's Attack Power for 2 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "atk_break", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "atk_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(91, spec.meta, multistep(spec.action))
}
