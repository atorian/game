// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 964
/** 
Surrounds all enemies with night and puts them to sleep for 2 turns and prevents them from receiving beneficial effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "sleep", 2, 100),
                debuff(roll, "blockBuff", 2, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(964, spec.meta, multistep(spec.action))
}
