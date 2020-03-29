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

// skill id: 947
/** 
Throws a small spirit at the enemy and increases your Critical Rate by 30% at next turn if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.8 + attacker.atk + -20,
                ),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 1)),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(947, spec.meta, multistep(spec.action))
}
