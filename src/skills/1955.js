// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1955
/** 
Attacks the enemy 2 times to inflict damage that ignores all damage reduction effects and increases the damage by 10% each according to the number of beneficial and harmful effects granted on the target. Boomerang Warrior's attacks will also ignore all of the target's beneficial effects when they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 76
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.debuff * 0.1,
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.debuff * 0.1,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1955, spec.meta, multistep(spec.action))
}
