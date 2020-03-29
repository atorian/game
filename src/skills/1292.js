// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1292
/** 
Attacks the enemy to inflict damage and Stuns the target for 1 turn. Attacks once more if the target is stunned by your attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If stun successful
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.4),
                debuff(roll, "stun", 1, 100),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1292, spec.meta, multistep(spec.action))
}
