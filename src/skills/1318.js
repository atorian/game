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

// skill id: 1318
/** 
Attacks all enemies and disturbs their HP recovery for 3 turns with a 75% chance. The damage of this attack will increase according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.maxHp * 0.18,
                ),
                debuff(roll, "heal_block", 3, 75),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1318, spec.meta, multistep(spec.action))
}
