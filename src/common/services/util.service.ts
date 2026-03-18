import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { hash } from "bcrypt";

@Injectable()
export class UtilService {
    
    constructor(private readonly jwtSvc: JwtService) {}

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public generateJWT(payload: any, secret: string, expiresIn: any = '60s'): Promise<string> {
        return this.jwtSvc.signAsync(
            payload, 
            { 
                secret: process.env.JWT_SECRET,
                expiresIn: expiresIn
            }
        );
    }

    public async getPayload(jwt: string): Promise<any> {
        return await this.jwtSvc.verifyAsync(jwt, { secret: process.env.JWT_SECRET });
    }
}