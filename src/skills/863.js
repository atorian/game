// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 863
/** 
Locks down the enemy target with the power of darkness to inflict damage that's proportionate to the enemy's MAX HP and decreases the target's Attack Bar by 50%. This attack recovers your attack Bar by 100% when used with full HP.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If at full HP
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 7.2 + target.maxHp * 0.15,
                ),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf, atbIncrease(100)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(863, spec.meta, multistep(spec.action))
}
