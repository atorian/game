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

// skill id: 179
/** 
Attacks the enemy and decreases their Attack Power for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.5 + attacker.atk + 15,
                ),
                debuff(roll, "atk_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 50,
            cooldown: 0,
        },
    }
    return new GenericSkill(179, spec.meta, multistep(spec.action))
}
