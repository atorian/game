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

// skill id: 1063
/** 
The faster your Attack Speed, the greater the damage becomes. Attack Speed is increased for 2 turns if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 70)) / 30,
                ),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1063, spec.meta, multistep(spec.action))
}
