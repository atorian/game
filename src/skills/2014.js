// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2014
/** 
Attacks all enemies and removes all beneficial effects granted on them. In addition, when used in Druid Form, increases their chances of landing a glancing hit for 2 turns and then transforms into Beast Form to Provoke all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "glancing", 2, null),
                debuff(roll, "provoke", 1, 30),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(2014, spec.meta, multistep(spec.action))
}
