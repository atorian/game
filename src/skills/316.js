// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 316
/** 
Weakens the enemy's Defense for 1 turn if you attack the enemy with no beneficial effects and freezes the enemy for 1 turn if you attack the enemy under a harmful effect. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If target under harmful effect
        // fixme: If target not under harmful effect
        action: [
            step(
                targetEnemy,
                debuff(roll, "freeze", 1, 100),
                debuff(roll, "def_break", 1, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(316, spec.meta, multistep(spec.action))
}
