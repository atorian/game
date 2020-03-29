// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1140
/** 
Attacks all enemies with a giant storm cloud to decrease their Defense for 2 turns and stuns them for 1 turn with a 50% chance. The damage of this skill will increase according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.7 + attacker.maxHp * 0.18,
                ),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "stun", 1, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(1140, spec.meta, multistep(spec.action))
}
