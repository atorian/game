// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1543
/** 
Attacks all enemies 2 times with shining sword energy. Each attack deals 25% increased damage if the enemy is under harmful effects, and deals 30% more damage if the target has dark attribute. This skill has a 70% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 30% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 66
        // fixme: If target is Dark
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.2 + attacker.debuff * 0.25,
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.2 + attacker.debuff * 0.25,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1543, spec.meta, multistep(spec.action))
}
