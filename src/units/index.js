
export type Ability = {
    id: string,
    target: 'enemy' | 'ally'
}

export type Passive = {
    id: string,
}

export type Skill = Ability | Passive

export type BaseUnit = {
    hp: number,
    atk: number,
    def: number,
    spd: number,
    cr: number,
    cd: number,
    res: number,
    acc: number,
    skills: Skill[]
}
