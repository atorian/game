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

// skill id: 1970
/** 
Attacks the enemy to stun the target for 1 turn and increases the harmful effect granted on the enemy by 1 turn. Chakram Dancer's attack will increase the enemy's harmful effect duration by 1 turn each with a 50% chance when they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 60
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.3),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1970, spec.meta, multistep(spec.action))
}
