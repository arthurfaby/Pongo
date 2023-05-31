import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SchoolStrategy extends PassportStrategy(Strategy, 'School') {
  constructor(private http: HttpService) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: 'http://localhost:3000/auth/42',
      scope: 'public',
    });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    return data;
  }
}
