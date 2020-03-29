// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2431
/** 
The faster your Attack Speed, the greater the damage becomes. Attacks the enemy to absorb the enemy's Attack Bar by 25% for each harmful effect granted on the target, up to 100%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 300)) / 100,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2431, spec.meta, multistep(spec.action))
}
