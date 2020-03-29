// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 751
/** 
Strikes random targets 4 times with the power of wind and removes all beneficial effects on the target. If this skill is on cooldown, you have a 25% chance to counterattack when attacked. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If skill on cooldown
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.5),
                strip(roll, 10, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(751, spec.meta, multistep(spec.action))
}
