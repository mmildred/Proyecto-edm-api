import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { UtilService } from "../../services/util.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly utilSvc: UtilService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = await this.utilSvc.getPayloadFromJWT(token);

            request.user = payload;
            
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
