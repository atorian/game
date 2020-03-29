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

// skill id: 83
/** 
Stuns the enemy with a Lightning Ball. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.8 + attacker.atk + 50,
                ),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(83, spec.meta, multistep(spec.action))
}
