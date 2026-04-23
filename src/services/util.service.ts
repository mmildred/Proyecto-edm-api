import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {
    constructor(
        private jwtService: JwtService
    ) { }

    public async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public async getPayload(user: any): Promise<any> {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            created_dt: user.created_dt,
            hash: user.hash,
            role: user.rol?.description ?? 'user',
        };
    }

    public async getPayloadFromJWT(token: string): Promise<any> {
        const payload = await this.jwtService.verifyAsync(token, 
        {secret: process.env.JWT_SECRET}
        );
        return payload;
    }

    public async generateToken(payload: any, expiresIn: any = '10000s'): Promise<string> {
        const jwt = await this.jwtService.signAsync(payload, {
            expiresIn: expiresIn as any,
            secret: process.env.JWT_SECRET,
        });
        return jwt;
    }
}