import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Crop } from 'src/crop/entities/crop.entity';
import { Farm } from 'src/farm/entities/farm.entity';
import { Harvest } from 'src/harvest/entities/harvest.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [User, Farm, Harvest, Crop],
      synchronize: true,
      logging: false,
    };
  }
}
