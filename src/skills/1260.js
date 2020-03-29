// @flow
import type { Ability } from "../index"
import { step, targetAlly, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1260
/** 
Deals damage to an enemy and recovers a turn if the enemy dies. If an enemy or ally dies while this skill is on cool down, [Endless Death] will instantly be reusable again. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 7.8),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1260, spec.meta, multistep(spec.action))
}
