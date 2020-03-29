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

// skill id: 1298
/** 
Increases the Critical Rate for 2 turns and instantly attacks an enemy with a powerful strike. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.7),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1298, spec.meta, multistep(spec.action))
}
