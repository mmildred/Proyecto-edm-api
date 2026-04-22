import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorador @Roles() para especificar los roles permitidos en una ruta.
 * @example
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);