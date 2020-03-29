// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 595
/** 
Covers the enemy with poison, removes 1 beneficial effect, and prevents the target from receiving beneficial effects for 1 turn with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.3),
                debuff(roll, "blockBuff", 1, 75),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(595, spec.meta, multistep(spec.action))
}
