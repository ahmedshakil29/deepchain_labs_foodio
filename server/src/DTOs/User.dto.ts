import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsUrl()
  @Matches(/^https:\/\/res\.cloudinary\.com\/.+/, {
    message: 'Image must be a Cloudinary URL',
  })
  imageUrl?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsUrl()
  @Matches(/^https:\/\/res\.cloudinary\.com\/.+/, {
    message: 'Image must be a Cloudinary URL',
  })
  imageUrl?: string;
}
