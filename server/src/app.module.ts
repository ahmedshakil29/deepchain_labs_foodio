import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, AdminModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
