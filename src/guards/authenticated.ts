import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as admin from 'firebase-admin';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthenticatedGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    // console.log('token', token)
    // console.log('roles', roles)

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      // console.log('decodedToken', decodedToken)

      if (decodedToken) {
        // match roles with decodedToken
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
