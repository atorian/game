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

// skill id: 77
/** 
Attacks the enemy at a breakneck speed. May stun the enemy with a 24% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.atk + -15,
                ),
                debuff(roll, "stun", 1, 24),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 40,
            cooldown: 0,
        },
    }
    return new GenericSkill(77, spec.meta, multistep(spec.action))
}
