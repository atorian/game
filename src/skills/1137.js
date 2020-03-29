// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1137
/** 
Summons an alter ego that attacks the enemy 4 times, granting you invincibility for 1 turn and immunity for 2 turns. Removes a beneficial effect granted on the enemy when an attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                strip(roll, 10, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("invincibility", 1)),
                buff((self, target) => target.buf("immunity", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1137, spec.meta, multistep(spec.action))
}
