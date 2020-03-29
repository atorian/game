// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1259
/** 
Attacks and Silences the enemy for 2 turns. If the target dies, all other enemies will receive the remaining Silence Effect. The enemies under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        // fixme: If target dies
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.5),
                debuff(roll, "silence", 2, 100),
                debuff(roll, "silence", 2, null),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1259, spec.meta, multistep(spec.action))
}
