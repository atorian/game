// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 674
/** 
Attacks an enemy with a wrathful axe, leaving a Branding Effect for 2 turns, and increasing your Attack Bar by 50%. The target with the Branding Effect will receive 25% increased damage.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.2),
                debuff(roll, "brand", 2, 100),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(674, spec.meta, multistep(spec.action))
}
