// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2359
/** 
Inflicts damage proportionate to your MAX HP with strengthened Energy Punch and destroys the target's MAX HP by 100% of the damage dealt. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.maxHp * 0.4,
                ),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2359, spec.meta, multistep(spec.action))
}
