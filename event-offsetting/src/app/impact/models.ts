import { User } from './dbModels';

export const recentUserColumns = [
    'id',
    'first_name',
    'last_name',
    'amount_kg',
    'origin_city',
    'origin_state',
    'travel_method'
] as const;
export type RecentUser = Pick<User, (typeof recentUserColumns)[number]>;

export const userLocationColumns = [
    'id',
    'first_name',
    'origin_latitude',
    'origin_longitude',
    'origin_city',
    'origin_state'
] as const;
export type UserLocation = Pick<User, (typeof userLocationColumns)[number]>;
