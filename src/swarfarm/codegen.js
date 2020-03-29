import prettier from "prettier";

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
};

const decapitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toLowerCase() + s.slice(1)
};

function renderDmg(step, imports) {
    let result = '';
    for (const dmgFuncName of ['atkDmg', 'atkAndDefDmg', 'defDmg', 'atkAndMaxHpDmg']) {
        // todo: atk.soulDestroy
        // todo: atk.debuffMultiplier
        const dmg = step[dmgFuncName];
        if (dmg) {
            const { ignoresDef, ignoresDefReduction, ...multipliers } = dmg;
            const atkParams = Object.entries(multipliers).map(([key, value]) => {
                const mod = key.includes('Multiplier') ? 'Multiplier' : 'Modifier';
                const stat = key.substr(0).replace(mod, '');
                if (mod === 'Multiplier') {
                    return `attacker.${stat} * ${value}`;
                } else if (mod === 'Modifier') {
                    return `attacker.${stat} + ${value}`;
                }
            });

            let fn = 'simpleDmg';
            if (ignoresDefReduction) {
                fn += 'WithoutDmgReduction';
            }
            if (ignoresDef) {
                fn += 'WithDefIgnore';
            }
            imports.push(fn);
            if (atkParams.length) {
                result += `${fn}(roll, (attacker) => ${atkParams.join(' + ')}),\n`;
            }
        }
    }

    for (const dmgFuncName of ['atkAndTargetMaxHpDmg']) {
        const dmg = step[dmgFuncName];
        if (dmg) {
            const { ignoresDef, ignoresDefReduction, ...multipliers } = dmg;
            const atkParams = Object.entries(multipliers).map(([key, value]) => {
                const target = key.startsWith('target') ? 'target' : 'attacker';
                const mod = key.includes('Multiplier') ? 'Multiplier' : 'Modifier';
                const stat = decapitalize(
                    key.substr(0).replace(mod, '').replace('target', '')
                );
                if (mod === 'Multiplier') {
                    return `${target}.${stat} * ${value}`;
                } else if (mod === 'Modifier') {
                    return `${target}.${stat} + ${value}`;
                }
            });
            let fn = 'simpleDmg';
            if (ignoresDefReduction) {
                fn += 'WithoutDmgReduction';
            }
            if (ignoresDef) {
                fn += 'WithDefIgnore';
            }
            imports.push(fn);
            result += `${fn}(roll, (attacker, target) => ${atkParams.join(' + ')}),\n`;
        }
    }

    if (step.lostHpDmg) {
        const { ignoresDef, ignoresDefReduction } = step.lostHpDmg;
        result += `fixedDmg(roll, attacker => attacker.maxHp - attacker.hp),\n`;
        imports.push('fixedDmg');
    }
    for (const dmgFuncName of ['spdDmg', 'atkAndCurHpDmg', 'atkAndTargetCurHpRateDmg']) {
        const dmg = step[dmgFuncName];
        // todo: atk.soulDestroy
        // todo: atk.debuffMultiplier
        if (dmg) {
            const { ignoresDef, ignoresDefReduction, divisor, ...multipliers } = dmg;
            const atkParams = Object.entries(multipliers).reduce((carry, [key, value]) => {
                const target = key.startsWith('target') ? 'target' : 'attacker';
                carry[target] = true;
                const mod = key.includes('Multiplier') ? 'Multiplier' : 'Modifier';
                const stat = decapitalize(
                    key.substr(0).replace(mod, '').replace('target', '')
                );
                if (stat !== 'curHpRate') {
                    carry[stat] = carry[stat] || `${target}.${stat}`;
                } else {
                    carry[stat] = carry[stat] || `${target}.hp / ${target}.maxHp`;
                }
                if (mod === 'Multiplier') {
                    carry[stat] += ` * ${value}`;
                } else if (mod === 'Modifier') {
                    carry[stat] += ` + ${value}`;
                }
                return carry;
            }, {});
            let fn = 'simpleDmg';
            if (ignoresDefReduction) {
                fn += 'WithoutDmgReduction';
            }
            if (ignoresDef) {
                fn += 'WithDefIgnore';
            }
            const { attacker, target, ...strMultipliers } = atkParams;
            const args = target ? '(attacker, target)' : 'attacker';
            imports.push(fn);
            if (divisor) {
                result += `${fn}(roll, ${args} => (${Object.values(strMultipliers).join(') * (')}) / ${divisor}),\n`;
            } else {
                result += `${fn}(roll, ${args} => (${Object.values(strMultipliers).join(') * (')})),\n`;
            }
        }
    }

    return result;
}

export function skill(skillData) {
    let result = '';
    if (skillData.passive) {
        result += '// fixme: passive skill\n';
    }

    if (skillData.notes) {
        for (const note of skillData.notes) {
            result += `// fixme: ${note}\n`;
        }
    }

    const imports = ['step'];
    result += 'action: [\n';

    for (let step of skillData.steps) {
        result += 'step(\n';
        result += `target${capitalize(step.target)},\n`;
        imports.push(`target${capitalize(step.target)}`);

        result += renderDmg(step, imports);

        if (step.atkHeal) {
            result += `heal((self, target) => self.atk * ${step.atkHeal}),\n`;
            imports.push(`heal`);
        }

        if (step.ratioHeal) {
            result += `heal((self, target) => target.maxHp * ${step.ratioHeal}),\n`;
            imports.push(`heal`);
        }

        if (step.myRatioHeal) {
            result += `heal((self, target) => self.maxHp * ${step.ratioHeal}),\n`;
            imports.push(`heal`);
        }

        if (step.atkAndRelativeSpdDmg) {
            result += '// fixme: atkAndRelativeSpdDmg\n'
        }

        if (step.debuffs) {
            for (let d of step.debuffs) {
                result += `debuff(roll, '${d[0]}', ${d[1]}, ${d[2]}),\n`;
                imports.push(`debuff`);
            }
        }
        if (step.buffs) {
            for (let d of step.buffs) {
                result += `buff((self, target) => target.buf('${d[0]}', ${d[1]})),\n`;
                imports.push(`buff`);
            }
        }

        if (step.additionalTurn) {
            if (step.additionalTurn[1]) {
                imports.push(`onKill`);
                result += `onKill(`
            }
            imports.push(`additionalTurn`);
            result += `additionalTurn(roll, ${step.additionalTurn[0]})\n`;
            if (step.additionalTurn[1]) {
                result += `),\n`
            }
        }

        if (step.groupAttack) {
            imports.push(`groupAttack`);
            result += `groupAttack((self) => ${step.groupAttack}), // fixme: might scale of something\n`
        }

        if (step.atbIncrease) {
            imports.push(`atbIncrease`);
            result += `atbIncrease(${step.atbIncrease}),\n`
        }

        if (step.atbDecrease) {
            imports.push(`atbDecrease`);
            result += `atbDecrease(roll, ${step.atbIncrease}),\n`
        }

        if (step.strip) {
            imports.push(`strip`);
            result += `strip(roll, ${step.strip[0]}, ${step.strip[1]}),\n`
        }

        if (step.skillRefresh) {
            imports.push(`skillRefresh`);
            result += `skillRefresh(${step.skillRefresh}),\n`
        }

        if (step.cleanse) {
            imports.push(`cleanse`);
            if (step.cleanse === Infinity) {
                result += `cleanse(10),\n`
            } else {
                result += `cleanse(${step.cleanse}),\n`
            }
        }

        result += '),\n';
    }

    let repeatableStep = skillData.steps[0];
    if (repeatableStep.additionalAttack) {
        imports.push(`withChance`);
        imports.push(`target${capitalize(repeatableStep.target)},`);
        result += `// fixme: check, chance source
withChance((self) => ${repeatableStep.additionalAttack}, step(
    target${capitalize(repeatableStep.target)},
    ${renderDmg(repeatableStep, imports)}
)),\n`
    }

    result += '],\n';
    result += 'meta: {\n';
    Object.entries(skillData.meta).forEach(([key, value]) => {
        result += `${key}: ${value},\n`;
    });
    result += '},\n';

    let uimport = new Set(imports);

    return `// @flow
import type { Ability } from "../index";
import { ${[...uimport].join(', ')}, multistep, GenericSkill } from "../skill";

// skill id: ${skillData.id} 
/** 
${skillData.description} 
*/
export default function(roll: () => number): Ability {
    const spec = {${result}};
    return new GenericSkill(
        ${skillData.id},
        spec.meta,
        multistep(spec.action),
    );
};`;
}

if (require.main === module) {
    const fs = require("fs");
    const input = fs.readFileSync(0, "utf-8");

    const skillsCfg = JSON.parse(input);

    for (const [id, s] of Object.entries(skillsCfg)) {
        fs.writeFileSync(
            `./src/skills/${id}.js`,
            prettier.format(skill(s), { semi: false, "tabWidth": 4, trailingComma: "all", parser: "babel" }),
        )
    }

    fs.writeFileSync(
        `./src/sw-skills.js`,
        prettier.format(`import {GenericSkills} from "./skill";
${Object.keys(skillsCfg)
                .map(id => `import skill${id} from "./skills/${id}";`)
                .join('\n')}
${Object.keys(skillsCfg)
                .map(id => `GenericSkills.set(${id}, require("./skills/${id}"));`)
                .join('\n')}
`,
            { semi: false, "tabWidth": 4, trailingComma: "all", parser: "babel" }
        )
    );
}
