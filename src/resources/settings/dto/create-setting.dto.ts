import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  Matches,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { timeZonesNames } from '@vvo/tzdb';

export class CreateSettingDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(2, 50, {
    message:
      'First name must be between $constraint1 and $constraint2 characters',
  })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(2, 50, {
    message:
      'Last name must be between $constraint1 and $constraint2 characters',
  })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Timezone must be a string' })
  @IsNotEmpty({ message: 'Timezone is required' })
  @Matches(/^[A-Za-z_]+\/[A-Za-z_]+$/, {
    message:
      'Timezone must be in format "Area/Location" (e.g. America/New_York)',
  })
  @IsIn(timeZonesNames)
  @Transform(({ value }) => value?.trim())
  timezone: string;
}
