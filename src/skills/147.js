// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 147
/** 
Launches an attack that ignores the enemy's Defense. This attack receives a 50% Critical Rate bonus. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 3.7),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 50)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(147, spec.meta, multistep(spec.action))
}
