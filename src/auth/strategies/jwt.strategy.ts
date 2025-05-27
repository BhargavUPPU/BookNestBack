import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Verify exp
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }
  async validate(payload: any): Promise<any> {
    return {
      userId: payload.sub,
      role: payload.user_metadata.role,
      collegeId: payload.user_metadata.college_id,
    }; // Return the payload to be attached to the request object
  }

  authenticate(req:Request) {
    super.authenticate(req);
  }
}
