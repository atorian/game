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

// skill id: 2167
/** 
Summons shooting stars that attack enemies randomly and blocks beneficial effects to be granted on them for 2 turns with an 80% chance. The inflicted damage increases if the same target gets hit again. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "blockBuff", 2, 80),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(2167, spec.meta, multistep(spec.action))
}
