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

// skill id: 2012
/** 
Attacks all enemies and weakens their Attack Power for 2 turns. In addition, when used in Druid Form, weakens the Defense of all enemies for 2 turns and then transforms into Beast Form to Provoke all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "provoke", 1, 30),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2012, spec.meta, multistep(spec.action))
}
