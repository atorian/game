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

// skill id: 1293
/** 
Swings a dagger to attack the enemy 2 times and subsequently increases your Attack Power for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 2)),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1293, spec.meta, multistep(spec.action))
}
