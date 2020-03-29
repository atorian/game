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

// skill id: 1110
/** 
Attacks the enemy 2 times that won't land as Glancing Hits to inflict damage which ignores all effects that resist death. You'll be immune to death for 1 turn if you defeat the enemy with this attack and the defeated enemy can't be revived. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("endure", 1)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1110, spec.meta, multistep(spec.action))
}
