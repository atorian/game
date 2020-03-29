// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 451
/** 
Attacks randomly with sharp feathers 6 times. Each strike reduces the enemy's Attack Bar by 20%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(451, spec.meta, multistep(spec.action))
}
