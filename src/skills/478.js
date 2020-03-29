// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 478
/** 
Attacks the enemy and creates a shield that's proportionate to the damage dealt for 3 turns. Gets another turn immediately if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Shield scales with ATK or Damage for skill: 478
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8.3),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(478, spec.meta, multistep(spec.action))
}
