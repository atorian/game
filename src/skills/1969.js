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

// skill id: 1969
/** 
Attacks all enemies with a boomerang and stuns them for 1 turn. The enemy target attacked by Chakram Dancer is guaranteed to be stunned when they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.8),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1969, spec.meta, multistep(spec.action))
}
