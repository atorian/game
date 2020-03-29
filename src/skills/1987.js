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

// skill id: 1987
/** 
Attacks all enemies to shorten the time of beneficial effects granted on them by 1 turn each. If the enemy doesn't have any beneficial effect, prevents the enemy from gaining beneficial effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 68
        // fixme: If enemy has no buffs
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "blockBuff", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1987, spec.meta, multistep(spec.action))
}
