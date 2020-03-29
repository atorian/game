// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2293
/** 
Absorbs all other allies' HP by 10% to attack all enemies dealing damage that's proportionate to the absorbed HP. Recovers the Attack Bar of all allies by 20% afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 3.4),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2293, spec.meta, multistep(spec.action))
}
