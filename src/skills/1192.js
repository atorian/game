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

// skill id: 1192
/** 
Attacks the enemy 2 times with each attack having a 75% chance to remove a beneficial effect of the enemy and a 75% chance to block the beneficial effects granted on the target for 2 turns. This attack won't land as Glancing Hits. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Element advantage behavior detected: 1192.
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "blockBuff", 2, 75),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1192, spec.meta, multistep(spec.action))
}
