// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    groupAttack,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2214
/** 
Teams up with two other allies to attack an enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                groupAttack(self => 2), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2214, spec.meta, multistep(spec.action))
}
