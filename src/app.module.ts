import {
  ConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Configuration } from './types/configuration';
import configuration from '@/config/configuration';
import { validate } from '@/config/config.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { SettingsModule } from './resources/settings/settings.module';
import * as fs from 'fs';
import { Settings } from '@/entities/settings.entity';
import { AuthModule } from './resources/auth/auth.module';

const envPath = `.env.${process.env.NODE_ENV ?? 'development'}`;
const envFileExists = fs.existsSync(envPath);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      ignoreEnvFile: !envFileExists,
      load: [configuration],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const configuration = configService.get('config') as Configuration;
        const database = configuration.database;

        const config = {
          type: database.driver,
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: [Settings],
          synchronize: database.synchronize,
        } as TypeOrmModuleOptions;
        return config;
      },
      inject: [NestConfigService],
    }),
    SettingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
