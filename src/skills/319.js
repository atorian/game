// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 319
/** 
Consumes half of your current HP to inflict damage that ignores the enemy's Defense. If your HP is full when it's your turn, [Desperate Arrow] cooldown time will reset. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(319, spec.meta, multistep(spec.action))
}
