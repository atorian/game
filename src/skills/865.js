// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 865
/** 
Swiftly attacks an enemy and weakens its defense for 1 turn with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "def_break", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(865, spec.meta, multistep(spec.action))
}
