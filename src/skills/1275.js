// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    buff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1275
/** 
Attacks the enemy 2 times with each attack decreasing the target's Attack Bar by 25%. Additionally, this attack will increase the Defense of all allies for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                buff((self, target) => target.buf("def", 3)),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1275, spec.meta, multistep(spec.action))
}
