import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }



  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const { password_hash, ...result } = user;
  //   return result;
  // }

  async login(user: any) {
    const payload = { email: user.email, sub: user.user_id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }
  

} 