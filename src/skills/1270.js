// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1270
/** 
Attacks an enemy and then removes all beneficial effects on the target. If there are 2 or more beneficial effects removed, the Attack Bar of all allies will be increased by 20% each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If 2 or more buffs removed
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1270, spec.meta, multistep(spec.action))
}
