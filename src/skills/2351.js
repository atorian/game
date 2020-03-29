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

// skill id: 2351
/** 
Attacks with a spinning punch and stuns the enemy for 1 turn with a 50% chance. The damage of this attack increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.maxHp * 0.2,
                ),
                debuff(roll, "stun", 1, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2351, spec.meta, multistep(spec.action))
}
