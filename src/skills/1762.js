// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1762
/** 
Emits magical energy to attack all enemies. The damage increases by 20% for each harmful effect on the enemies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.debuff * 0.3,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1762, spec.meta, multistep(spec.action))
}
