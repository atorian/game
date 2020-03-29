// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    simpleDmg,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 128
/** 
Removes up to 6 harmful effects on an ally and attacks if possible. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                cleanse(6),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(128, spec.meta, multistep(spec.action))
}
