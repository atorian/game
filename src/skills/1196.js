// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    strip,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1196
/** 
Attacks all enemies with world devouring powers to remove the beneficial effects on all enemies and to decrease their Attack Bar by 15% each. Additionally decreases each enemy's Attack Bar by 15% per beneficial effect removed from each enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Per buff removed
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.4),
                atbDecrease(roll, undefined),
                strip(roll, 10, 100),
            ),
            step(targetSelf, atbDecrease(roll, undefined)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1196, spec.meta, multistep(spec.action))
}
