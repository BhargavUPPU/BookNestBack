import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: 40000 },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ JwtAuthGuard,JwtStrategy, PrismaService],
  exports: [ JwtModule,  JwtAuthGuard],
})
export class AuthModule {}
