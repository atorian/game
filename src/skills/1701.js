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

// skill id: 1701
/** 
Attacks and Stuns the enemy for 1 turn with a 25% chance. The damage increases accordingly to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "stun", 1, 25),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1701, spec.meta, multistep(spec.action))
}
