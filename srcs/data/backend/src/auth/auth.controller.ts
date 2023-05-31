import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('42')
  @UseGuards(AuthGuard('School'))
  async getUserFrom42(@Req() req, @Res() res) {
    const [token, up] = await this.authService.schoolLogin(req);
    const user = await this.userService.findOneByEmail(req.user.email);
    if (user.doubleAuth) {
      const htmlDoubleAuth = `
      <html>
      <script>
        window.location.href = 'http://localhost:4200/doubleAuth/?JWT=${token.access_token}';
      </script>
      </html>
      `;
      res.send(htmlDoubleAuth);
    } else {
      const htmlWithEmbeddedJWT = `
      <html>
      <script>
        window.location.href = 'http://localhost:4200/home/?UP=${up}JWT${token.access_token}';
      </script>
      </html>
      `;
      res.send(htmlWithEmbeddedJWT);
    }
  }

  @Get('doubleAuth2')
  async checkVerifCode2(@Req() req) {
    const codepin = req.headers.codepin;
    const token = req.headers.jwt;
    if (!token) {
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      req['user'] = payload;
    } catch {
      return;
    }
    if (!req.user.doubleAuth) return;
    const user = await this.userService.findOneById(req.user.sub);
    if (!user) return;
    if (user.code == codepin && (Date.now() % 100000000) - user.time < 360000) {
      const token = await this.authService.doubleAuth(user);
      return JSON.stringify(`http://localhost:4200/home/?JWT=${token}`);
    }
  }
}
