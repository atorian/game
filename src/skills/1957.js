// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1957
/** 
Attacks an enemy target 2 times to replace all of the target's beneficial effects with continuous damage effects. Additionally decreases the enemy's HP by 5% each according to the number of continuous damage effects granted on the target, afterwards. Boomerang Warrior will inflict continuous damage on the enemy for 1 turn when they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: According to number of buffs removed
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "dot", null, 100),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "dot", null, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1957, spec.meta, multistep(spec.action))
}
