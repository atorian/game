// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 567
/** 
Inflicts damage with strengthened Energy Punch proportionate to your MAX HP and destroys the target's MAX HP by 30% of the damage dealt. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.3 + attacker.maxHp * 0.3,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(567, spec.meta, multistep(spec.action))
}
