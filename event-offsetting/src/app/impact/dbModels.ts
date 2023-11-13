import { Insertable, Selectable, Updateable } from 'kysely';

import { users } from '@/generated/types';

export type User = Selectable<users>;
export type NewUser = Insertable<users>;
export type UserUpdate = Updateable<users>;
