import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Assuming you have a User entity
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
