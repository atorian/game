// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1736
/** 
Uses Mana to attack the enemy and inflict damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.6),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1736, spec.meta, multistep(spec.action))
}
