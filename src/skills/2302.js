// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2302
/** 
Attacks the enemy to inflict damage that increases according to your Defense and increases your Defense by 30%. (Accumulates up to 5 times) 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.def * 2.9,
                ),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("def", null)),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2302, spec.meta, multistep(spec.action))
}
