// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 349
/** 
Performs an attack that deals more damage accordingly to how low the enemy's HP is. If the enemy has lower than 30% HP, this attack will deal 100% more damage.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -3.3 + 8.8),
                ),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(349, spec.meta, multistep(spec.action))
}
