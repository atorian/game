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

// skill id: 2411
/** 
The faster your Attack Speed, the greater the damage becomes. Attacks the enemy with the beast 2 times. The beast's attack weakens the enemy's Defense for 1 turn, and the rider's attack absorbs the enemy's Attack Bar by 25% for each harmful effect granted on the target, up to 100%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 25% ATB per harmful effect
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 100,
                ),
                debuff(roll, "def_break", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 100,
                ),
                debuff(roll, "def_break", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2411, spec.meta, multistep(spec.action))
}
