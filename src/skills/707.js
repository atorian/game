// @flow
import type { Ability } from "../index"
import { step, targetAlly, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 707
/** 
Attacks an enemy, reviving 1 ally Monster with 30% HP if the enemy is eliminated by this attack. If there is no revivable ally on the field, all allies will receive a damage absorbing shield for 2 turns. The amount of absorption differs according to your Monster's level. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 8.2),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(707, spec.meta, multistep(spec.action))
}
