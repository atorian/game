// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 723
/** 
Counterattacks the enemy to inflict damage proportionate to your Attack Power and decreases the skill cooldown when you're attacked (counterattacks excluded). [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(723, spec.meta, multistep(spec.action))
}
