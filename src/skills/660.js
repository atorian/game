// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 660
/** 
Attacks an enemy 3 times. Each attack has a 35% chance to decrease the enemy's Defense for 3 turns. The damage of this attack increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.4 + attacker.maxHp * 0.1,
                ),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(660, spec.meta, multistep(spec.action))
}
