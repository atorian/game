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

// skill id: 134
/** 
Attacks the enemy with a spear and increases the Attack Speed for 2 turns if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.atk + -20,
                ),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", null)),
            ),
        ],
        meta: {
            dmg: 45,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(134, spec.meta, multistep(spec.action))
}
