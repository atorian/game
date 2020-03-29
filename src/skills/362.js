// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 362
/** 
Throws a punch that ignores the enemy's Defense and weakens the Attack Power for 1 turn with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "atk_break", 1, 80),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(362, spec.meta, multistep(spec.action))
}
