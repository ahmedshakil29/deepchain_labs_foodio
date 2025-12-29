import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule, // access user service
    ConfigModule.forRoot(), // load .env variables
    JwtModule.register({
      global: true, // optional: makes JwtService available everywhere
      secret: process.env.JWT_SECRET || 'defaultSecret', // fallback secret
      signOptions: { expiresIn: '3600s' }, // 1 hour
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // optional: allow other modules to use AuthService
})
export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UserModule } from '../users/users.module';

// @Module({
//   imports: [
//     UserModule,
//     ConfigModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         secret: config.get<string>('JWT_SECRET') || 'defaultSecret', // fallback secret
//         signOptions: {
//           expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h', // fallback 1 hour
//         },
//       }),
//     }),
//   ],
//   providers: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}
