// @flow
import type { Ability } from "../index"
import { step, targetAlly, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1425
/** 
Attacks the target and increases the Attack Bar of the ally with the lowest Attack Bar by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Of party member with lowest ATB
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 3.5),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1425, spec.meta, multistep(spec.action))
}
