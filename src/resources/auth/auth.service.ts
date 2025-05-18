import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from '@/utils/secure';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await hashPassword(registerDto.password);

      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(
        `Error during registration: ${error.message}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Registration failed. Please try again later.',
      );
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'fullName'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        user: await this.userRepository.findOne({
          where: { email },
          select: ['id', 'email', 'fullName'],
        }),
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(
        `Error during login for email ${loginAuthDto.email}: ${error.message}`,
        error.stack,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Login failed. Please try again later.',
      );
    }
  }
}
