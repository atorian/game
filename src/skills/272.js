// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 272
/** 
Inflicts damage proportionate to the enemy's MAX HP and stuns the enemy for 1 turn. If the target is immune to Stun, the damage will be increased by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 5.2 + target.maxHp * 0.16,
                ),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(272, spec.meta, multistep(spec.action))
}
