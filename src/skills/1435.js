// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1435
/** 
Removes all harmful effects on all allies and grants immunity on the allies with no harmful effects to be removed for 2 turns. Afterwards, creates a shield that's proportionate to your Defense on all allies for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If no harmful effects to cleanse
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.def * 2.5),
                buff((self, target) => target.buf("immunity", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            shield: 0.2,
        },
    }
    return new GenericSkill(1435, spec.meta, multistep(spec.action))
}
