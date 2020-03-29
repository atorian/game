// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 435
/** 
Brings an inevitable judgment upon all enemies, stunning them and decreasing their Defense for 1 turn. The inflicted damage is proportionate to the enemy's MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 1.6 + target.maxHp * 0.06,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(435, spec.meta, multistep(spec.action))
}
