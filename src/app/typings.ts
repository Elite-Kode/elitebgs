import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResult } from 'mongoose';

export interface EBGSFactionSchema {
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
    faction_presence: {
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
        updated_at: string;
        controlling: boolean;
    }[];
    history: {
        _id: string;
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
    }[];
}

interface EBGSSystemSchema {
    _id: string;
    __v: number;
    eddb_id: number;
    name: string;
    name_lower: string;
    x: number;
    y: number;
    z: number;
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
    factions: {
        faction_id: string;
        name: string;
        name_lower: string;
    }[];
    updated_at: string;
    history: {
        _id: string;
        updated_at: string;
        updated_by: string;
        population: number;
        government: string;
        allegiance: string;
        state: string;
        security: string;
        controlling_minor_faction: string;
        factions: {
            faction_id: string;
            name: string;
            name_lower: string;
        }[];
    }[];
}

interface EBGSFactionSchemaWOHistory {
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
    faction_presence: {
        system_id: string;
        system_name: string;
        system_name_lower: string;
        state: string;
        influence: number;
        pending_states: {
            state: string;
            trend: number;
        }[];
        recovering_states: {
            state: string;
            trend: number;
        }[];
    }[];
}

interface EBGSSystemSchemaWOHistory {
    _id: string;
    __v: number;
    eddb_id: number;
    name: string;
    name_lower: string;
    x: number;
    y: number;
    z: number;
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
    factions: {
        faction_id: string;
        name: string;
        name_lower: string;
    }[];
    updated_at: string;
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
    allegiance: string;
    state: string;
    distance_from_star: number;
    controlling_minor_faction: string;
    services: {
        name: string;
        name_lower: string;
    }[];
    history: {
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
    }[];
}

interface EBGSStationSchemaWOHistory {
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
    allegiance: string;
    state: string;
    distance_from_star: number;
    controlling_minor_faction: string;
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
        since: string;
    };
    donation: {
        _id: string;
        amount: number;
        date: string;
    }[];
    invite: string;
    invite_used: boolean;
    factions: {
        name: string;
        name_lower: string;
    }[];
    systems: {
        name: string;
        name_lower: string;
    }[];
}

type EBGSSystemFaction = EBGSSystemSchema['factions'][0];

interface EBGSSystemFactionChartSchema extends EBGSSystemFaction {
    influence: number;
    state: string;
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
    updated_at: string;
}

type EBGSFactionHistory = EBGSFactionSchema['history'][0];

interface EBGSFactionHistoryList extends EBGSFactionHistory {
    faction: string;
}

interface EBGSSystemChartSchema extends EBGSSystemSchema {
    factions: EBGSSystemFactionChartSchema[];
    faction_history: EBGSFactionHistoryList[];
    controlling_faction: EBGSSystemFactionChartSchema;
}

interface EBGSDonorSchema {
    _id: string;
    username: string;
    amount: number;
    date: string;
}

interface EBGSPatronSchema {
    _id: string;
    username: string;
    level: number;
    since: string;
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

export type EBGSFactions = PaginateResult<EBGSFactionSchema>;
export type EBGSSystemChartPaginate = PaginateResult<EBGSSystemChartSchema>;
export type EBGSFactionsWOHistory = PaginateResult<EBGSFactionSchemaWOHistory>;
export type EBGSSystemsWOHistory = PaginateResult<EBGSSystemSchemaWOHistory>;

export type EBGSStations = PaginateResult<EBGSStationSchema>;
export type EBGSStationsWOHistory = PaginateResult<EBGSStationSchemaWOHistory>;

export type EBGSUser = EBGSUserSchema;
export type EBGSUsers = PaginateResult<EBGSUser>;

export type EBGSSystemChart = EBGSSystemChartSchema;

export type EBGSDonor = EBGSDonorSchema;
export type EBGSPatron = EBGSPatronSchema;
export type EBGSCredits = EBGSCreditsSchema;

export type Tick = TickSchema[];
export type TickDisplay = TickDisplaySchema[];
