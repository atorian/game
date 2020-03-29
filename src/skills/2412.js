// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmgWithDefIgnore,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2412
/** 
Attacks the enemy with the beast 2 times. The beast's attack removes all beneficial effects granted on the enemy, and the rider's attack ignores the enemy's Defense by 35% for each beneficial effect the beast removed. Afterwards, the Attack Bar of other allies will be increased, up to 50%, in proportion to the enemy's lost HP from this attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 35% per beneficial effect removed
        action: [
            step(
                targetAllies,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 3.8),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 3.8),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(2412, spec.meta, multistep(spec.action))
}
