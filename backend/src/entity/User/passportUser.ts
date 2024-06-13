import { LP_User } from './LP_User';

declare global {
    namespace Express {
        interface User extends LP_User {}
    }
}