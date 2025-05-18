import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]), // Registra la entidad para este módulo
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
