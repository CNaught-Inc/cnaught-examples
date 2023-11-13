import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type users = {
    id: Generated<number>;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    cnaught_subaccount_id: string;
    created_on: Generated<Timestamp>;
    origin_latitude: number;
    origin_longitude: number;
    origin_city: string;
    origin_state: string;
    travel_method: string;
    amount_kg: number;
};
export type DB = {
    users: users;
};
