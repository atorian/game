// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 270
/** 
Attacks random enemies with arrows of high velocity to inflict damage that increases according to the Attack Speed. Each arrow has a 50% chance to Silence the targets for 1 turn. The enemies under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: spdDmg multiplier is broken
        action: [
            step(targetEnemies, debuff(roll, "silence", 1, 50)),
            step(targetEnemies, debuff(roll, "silence", 1, 50)),
            step(targetEnemies, debuff(roll, "silence", 1, 50)),
            step(targetEnemies, debuff(roll, "silence", 1, 50)),
            step(targetEnemies, debuff(roll, "silence", 1, 50)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(270, spec.meta, multistep(spec.action))
}
