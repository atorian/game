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

// skill id: 503
/** 
Attacks with giant claws to weaken the enemy's defense with a 50% chance and inflicts Continuous Damage for 3 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "dot", 3, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(503, spec.meta, multistep(spec.action))
}
