import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedRequest extends Express.Request {
    user: JwtPayload;
}
