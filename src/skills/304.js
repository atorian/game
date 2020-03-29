// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 304
/** 
Attacks the enemy 2 times with each attack having a 30% chance to stun the enemy for 1 turn. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.6 + attacker.maxHp * 0.13,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(304, spec.meta, multistep(spec.action))
}
