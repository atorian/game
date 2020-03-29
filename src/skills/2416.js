// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2416
/** 
Attacks all enemies with the beast 2 times. The beast's attack sets the enemies' Attack Bar to 0, and the rider's attack inflicts damage that increases up to 100% in proportion to the Attack Bar that the beast decreased. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(2416, spec.meta, multistep(spec.action))
}
