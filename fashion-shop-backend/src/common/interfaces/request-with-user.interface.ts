import { Request } from 'express';
import { UserRole } from '../decorators/roles.decorator';

// Interface para el usuario autenticado (extraído del JWT)
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Usar el enum en lugar de string
}

// Interface para Request con usuario autenticado
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}