import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { StatsDto } from 'src/stats/dto/stats.dto';
import { StatsService } from 'src/stats/stats.service';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private statsService: StatsService,
    private mailingService: MailingService,
  ) {}

  async signIn(username: string, email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.email !== email) {
      return;
    }
    if (user.doubleAuth) {
      const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      this.mailingService.sendMail(user.email, code);
      user.code = code;
      user.time = Date.now() % 100000000;
      this.usersService.update(user);
      const payload = {
        username: user.username,
        sub: user.id,
        doubleAuth: true,
      };
      const access_token: string = await this.jwtService.signAsync(payload);
      return {
        access_token,
      };
    } else {
      const payload = {
        username: user.username,
        sub: user.id,
        doubleAuth: false,
      };
      const access_token: string = await this.jwtService.signAsync(payload);
      return {
        access_token,
      };
    }
  }

  async signUp(username: string, email: string, url: string): Promise<any> {
    const tmp = await this.usersService.findOneByEmail(email);
    if (tmp) {
      return;
    }
    const user: UserDto = new UserDto(username, email, url);
    await this.usersService.create(user);
    const user2 = await this.usersService.findOneByEmail(email);
    const stats: StatsDto = new StatsDto(user2.id);
    await this.statsService.create(stats);
    const payload = { username: user2.username, sub: user2.id };
    const access_token: string = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }

  async validateUser(username: string, email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user != null && user.email === email) {
      const { email, ...result } = user;
      return result;
    }
    return null;
  }

  async schoolLogin(req): Promise<any> {
    if (!req.user) {
      return;
    }
    if ((await this.usersService.findOneByEmail(req.user.email)) == null) {
      const token: string = await this.signUp(
        req.user.login,
        req.user.email,
        req.user.image.link,
      );
      return [token, 1];
    } else {
      const token: any = await this.signIn(req.user.login, req.user.email);
      return [token, 0];
    }
  }

  async doubleAuth(user: UserDto): Promise<any> {
    const payload = {
      username: user.username,
      sub: user.id,
      doubleAuth: false,
    };
    const access_token: string = await this.jwtService.signAsync(payload);
    return access_token;
  }
}
