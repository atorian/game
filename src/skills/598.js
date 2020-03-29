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

// skill id: 598
/** 
Attacks all enemies with the power of jealousy and weakens the Defense for 2 turns with a 50% chance. The effect is activated with a 100% chance if the enemy has beneficial effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 100% Chance if enemy has buffs
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(598, spec.meta, multistep(spec.action))
}
