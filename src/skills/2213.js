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

// skill id: 2213
/** 
Teams up with another ally to attack an enemy. The number of allies you attack together increases up to 3 according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                groupAttack(self => 3), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2213, spec.meta, multistep(spec.action))
}
