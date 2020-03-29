// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2289
/** 
Decreases the current HP of the enemy with the best HP status (Boss excluded) by 10%, and attacks the enemy target to inflict damage that's proportionate to the reduced HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2289, spec.meta, multistep(spec.action))
}
