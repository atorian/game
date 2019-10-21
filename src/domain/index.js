export type EnemyTarget = 'enemy' | 'aoe_enemy';
export type AllyTarget = 'self' | 'ally' | 'aoe_ally' | 'not_self';
export type Target = AllyTarget & EnemyTarget ;

export type Ability = {
    id: string,
    target: Target
}

export type Passive = {
    id: string,
    guard: Object,
    iterations: any[],
}

export type BattleType = 'arena' | 'guild' | 'dungeon' | 'raid';
export type UnitStat = 'hp' | 'atk' | 'def' | 'spd' | 'cr' | 'cd' | 'acc' | 'res';

export type LeaderAbility = {
    battle_type?: BattleType,
    element: Element,
    stat: UnitStat,
    value: 0.3,
}

export type Skill = Ability | Passive
export type Element = 'wind' | 'water' | 'fire' | 'light' | 'dark';

export type BaseUnit = {
    name: string,
    element: Element,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    cr: number,
    cd: number,
    res: number,
    acc: number,
    leader_ability?: LeaderAbility,
    skills: Skill[]
}

export type Owned = {
    player: string,
}

export type UnitId = string;

export type RuneSet =
    'Energy'
    | 'Swift'
    | 'Fatal'
    | 'Blade'
    | 'Rage'
    | 'Guard'
    | 'Violent'
    | 'Shield'
    | 'Will'
    | 'Endure'
    | 'Focus';

export type Rune = {
    set: RuneSet,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    'hp%': number,
    'atk%': number,
    'def%': number,
    cr: number,
    cd: number,
    acc: number,
    res: number,
    slot: 1 | 2 | 3 | 4 | 5 | 6
}

export type Unit = BaseUnit & {
    id: UnitId,
    player: string,
    max_hp: number,
    max_atk: number,
    max_def: number,
    max_spd: number,
    max_cr: number,
    max_cd: number,
    max_acc: number,
    max_res: number,
    rune_sets: RuneSet[],
}

export type Targeted = {
    target: UnitId
}

export type Effect = Targeted & {
    effect: string,
}

export type Temporal = {
    duration: number,
};

export type TemporalEffect = Effect & Temporal;
export type StatDecrease = TemporalEffect & {
    stat: string,
    value: number,
}

export type Contestant = Unit & {
    atb: number,
    glancing_mod: number,
    effects: TemporalEffect | StatDecrease[],
    is_dead: boolean,
    is_revivable: boolean,
    cooldowns: { [string]: number }
}

function hasRuneSetEquiped(unit: Contestant, set: string): boolean {
    return unit.rune_sets.
}

