import { ROLE } from 'src/@types/roles';

export interface UserPayload {
  firstName: string;
  lastName: string;
  picture?: string | null;
  email: string;
  role: ROLE;
}
