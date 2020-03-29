// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1634
/** 
Rolls the dice 4 times to attack all enemies. The larger the number of dice, the greater the damage. If the number is the same as the previous number, the attack ignores the enemy's Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(
                    roll,
                    attacker =>
                        attacker.atk * 1 +
                        attacker.dice * 0.1 +
                        attacker.dice +
                        0.7,
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(
                    roll,
                    attacker =>
                        attacker.atk * 1 +
                        attacker.dice * 0.1 +
                        attacker.dice +
                        0.7,
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(
                    roll,
                    attacker =>
                        attacker.atk * 1 +
                        attacker.dice * 0.1 +
                        attacker.dice +
                        0.7,
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(
                    roll,
                    attacker =>
                        attacker.atk * 1 +
                        attacker.dice * 0.1 +
                        attacker.dice +
                        0.7,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1634, spec.meta, multistep(spec.action))
}
