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

// skill id: 1451
/** 
Calls upon the power of light to inflict damage ignoring enemy's defense. Gains 1 turn of invincibility if the enemy dies.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 3.8),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("invincibility", 1)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1451, spec.meta, multistep(spec.action))
}
