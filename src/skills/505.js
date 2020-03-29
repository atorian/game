// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    simpleDmg,
    groupAttack,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 505
/** 
Teams up with another ally to attack an enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                groupAttack(self => 1), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(505, spec.meta, multistep(spec.action))
}
