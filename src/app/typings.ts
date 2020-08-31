import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResult } from 'mongoose';

interface EBGSFactionPresence {
    system_id: string;
    system_name: string;
    system_name_lower: string;
    state: string;
    influence: number;
    happiness: string;
    active_states: {
        state: string;
    }[];
    pending_states: {
        state: string;
        trend: number;
    }[];
    recovering_states: {
        state: string;
        trend: number;
    }[];
    conflicts: EBGSFactionConflict[];
    updated_at: string;
}

export interface EBGSFactionConflict {
    type: string;
    status: string;
    system_id: string;
    system_name: string;
    opponent_name: string;
    opponent_name_lower: string;
    opponent_faction_id: string;
    station_id: string;
    stake: string;
    stake_lower: string;
    days_won: number;
}

export interface EBGSFactionSystemDetails extends EBGSFactionPresence {
    system_details: EBGSSystemSchema;
    controlling: boolean;
}

export interface EBGSFactionHistory {
    _id: string;
    __v: number;
    system_id: string;
    updated_at: string;
    updated_by: string;
    system: string;
    system_lower: string;
    state: string;
    influence: number;
    happiness: string;
    active_states: {
        state: string;
    }[];
    pending_states: {
        state: string;
        trend: number;
    }[];
    recovering_states: {
        state: string;
        trend: number;
    }[];
    systems: {
        name: string;
        name_lower: string;
    }[];
    conflicts: {
        type: string;
        status: string;
        opponent_name: string;
        opponent_name_lower: string;
        stake: string;
        stake_lower: string;
        days_won: number;
    }[];
}

export interface EBGSFactionHistoryDetailed extends Omit<EBGSFactionHistory, 'system' | 'system_lower' | 'system_id'> {
    faction_id: string;
    faction_name: string;
    faction_name_lower: string;
}

export interface EBGSFactionSchema extends EBGSFactionSchemaMinimal {
    faction_presence: EBGSFactionPresence[];
}

export interface EBGSFactionSystemSchema extends EBGSFactionSchemaMinimal {
    faction_presence: EBGSFactionPresence;
}

export interface EBGSFactionSchemaDetailed extends Omit<EBGSFactionSchema, 'faction_presence'> {
    faction_presence: EBGSFactionSystemDetails[];
    history: EBGSFactionHistory[];
    controlling: boolean;
}

export interface EBGSFactionSchemaMinimal {
    _id: string;
    __v: number;
    eddb_id: number;
    name: string;
    name_lower: string;
    updated_at: string;
    government: string;
    allegiance: string;
    home_system_name: string;
    is_player_faction: boolean;
}

export interface EBGSSystemFaction {
    faction_id: string;
    name: string;
    name_lower: string;
}

export interface EBGSSystemFactionDetails extends EBGSSystemFaction {
    faction_details: EBGSFactionSystemSchema;
}

export interface EBGSSystemSchema extends EBGSSystemSchemaMinimal {
    factions: EBGSSystemFaction[];
    conflicts: {
        type: string;
        status: string;
        faction1: {
            faction_id: string;
            name: string;
            name_lower: string;
            station_id: string;
            stake: string;
            stake_lower: string;
            days_won: number;
        };
        faction2: {
            faction_id: string;
            name: string;
            name_lower: string;
            station_id: string;
            stake: string;
            stake_lower: string;
            days_won: number;
        };
    }[];
}

export interface EBGSSystemHistory {
    _id: string;
    updated_at: string;
    updated_by: string;
    population: number;
    government: string;
    allegiance: string;
    state: string;
    security: string;
    controlling_minor_faction: string;
    controlling_minor_faction_cased: string;
    controlling_minor_faction_id: string;
    factions: EBGSSystemFaction[];
    conflicts: {
        type: string;
        status: string;
        faction1: {
            name: string;
            name_lower: string;
            stake: string;
            stake_lower: string;
            days_won: number;
        };
        faction2: {
            name: string;
            name_lower: string;
            stake: string;
            stake_lower: string;
            days_won: number;
        };
    }[];
}

export interface EBGSSystemSchemaDetailed extends Omit<EBGSSystemSchema, 'factions'> {
    factions: EBGSSystemFactionDetails[];
    history: EBGSSystemHistory[];
    faction_history: EBGSFactionHistoryDetailed[];
}

export interface EBGSSystemSchemaMinimal {
    _id: string;
    __v: number;
    eddb_id: number;
    name: string;
    name_lower: string;
    x: number;
    y: number;
    z: number;
    system_address: string,
    population: number;
    government: string;
    allegiance: string;
    state: string;
    security: string;
    primary_economy: string;
    secondary_economy: string;
    needs_permit: boolean;
    reserve_type: string;
    controlling_minor_faction: string;
    controlling_minor_faction_cased: string;
    controlling_minor_faction_id: string;
    updated_at: string;
}

export interface EBGSStationSchemaDetailed extends EBGSStationSchema {
    history: EBGSStationHistory[];
}

export interface EBGSStationHistory {
    _id: string;
    updated_at: string;
    updated_by: string;
    government: string;
    allegiance: string;
    state: string;
    controlling_minor_faction: string;
    services: {
        name: string;
        name_lower: string;
    }[];
}

export interface EBGSStationSchema {
    _id: string;
    __v: number;
    eddb_id: number;
    name: string;
    name_lower: string;
    type: string;
    system: string;
    system_lower: string;
    updated_at: string;
    government: string;
    economy: string;
    all_economies: {
        name: string,
        proportion: number
    }[];
    allegiance: string;
    state: string;
    market_id: string;
    distance_from_star: number;
    controlling_minor_faction: string;
    controlling_minor_faction_cased: string;
    controlling_minor_faction_id: string;
    services: {
        name: string;
        name_lower: string;
    }[];
}

interface EBGSUserSchema {
    _id: string;
    __v: number;
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    access: number;
    os_contribution: number;
    patronage: {
        level: number;
        since: Date;
    };
    donation: {
        _id: string;
        amount: number;
        date: Date;
    }[];
    factions: {
        name: string;
        name_lower: string;
    }[];
    systems: {
        name: string;
        name_lower: string;
    }[];
}

// interface EBGSSystemFactionChartSchema extends EBGSSystemFaction {
//     influence: number;
//     state: string;
//     happiness: string;
//     active_states: {
//         state: string;
//     }[];
//     pending_states: {
//         state: string;
//         trend: number;
//     }[];
//     recovering_states: {
//         state: string;
//         trend: number;
//     }[];
//     updated_at: string;
// }

// interface EBGSFactionHistoryList extends EBGSFactionHistory {
//     faction: string;
//     faction_lower: string;
// }

// interface EBGSSystemChartSchema extends EBGSSystemSchemaDetailed {
//     factions: EBGSSystemFactionChartSchema[];
//     faction_history: EBGSFactionHistoryList[];
//     controlling_faction: EBGSSystemFactionChartSchema;
// }

interface EBGSDonorSchema {
    _id: string;
    username: string;
    amount: number;
    date: Date;
}

interface EBGSPatronSchema {
    _id: string;
    username: string;
    level: number;
    since: Date;
}

interface EBGSCreditsSchema {
    _id: string;
    username: string;
    avatar: string;
    id: string;
    os_contribution: number;
    level: number;
}

export interface TickSchema {
    _id: string;
    time: string;
    updated_at: string;
}

export interface TickDisplaySchema {
    _id: string;
    time: string;
    timeLocal: string;
    updated_at: string;
}

export interface IngameIdsSchema {
    state: any;
    superpower: any;
    economy: any;
    government: any;
    security: any;
    station: any;
    happiness: any;
}

export type EBGSFactionsDetailed = PaginateResult<EBGSFactionSchemaDetailed>;
export type EBGSFactionsMinimal = PaginateResult<EBGSFactionSchemaMinimal>;

// export type EBGSSystemChartPaginate = PaginateResult<EBGSSystemChartSchema>;
export type EBGSSystemsDetailed = PaginateResult<EBGSSystemSchemaDetailed>;
export type EBGSSystemsMinimal = PaginateResult<EBGSSystemSchemaMinimal>;

export type EBGSStationsDetailed = PaginateResult<EBGSStationSchemaDetailed>;
export type EBGSStations = PaginateResult<EBGSStationSchema>;

export type EBGSUser = EBGSUserSchema;
export type EBGSUsers = PaginateResult<EBGSUser>;

// export type EBGSSystemChart = EBGSSystemChartSchema;

export type EBGSDonor = EBGSDonorSchema;
export type EBGSPatron = EBGSPatronSchema;
export type EBGSCredits = EBGSCreditsSchema;

export type Tick = TickSchema[];
export type TickDisplay = TickDisplaySchema[];
export type EBGSSystemHistoryPaginate = PaginateResult<EBGSSystemHistory>;
export type EBGSFactionHistoryPaginate = PaginateResult<EBGSFactionHistory>;
export type EBGSStationHistoryPaginate = PaginateResult<EBGSStationHistory>;
