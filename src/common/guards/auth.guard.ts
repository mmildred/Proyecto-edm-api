import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { UtilService } from "../services/util.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly utilSvc: UtilService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Obtenemos el request del contexto
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // Verificamos si el usuario está autenticado (verificar que exista el token)
        if (!token)
            throw new UnauthorizedException('No token provided');

        try {
            // Si existe el token, verificar el tiempo de expiración del token
            const payload = this.utilSvc.getPayload(token);

            // Si el token es funcional agregar el usaer (payload)
            request.user = payload;
        }
        catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        // Devolver el resultado de la verificación (true o false)
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;

    }
}