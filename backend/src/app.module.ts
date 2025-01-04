import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './utils/config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FarmModule } from './farm/farm.module';
import { CropModule } from './crop/crop.module';
import { HarvestModule } from './harvest/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    UserModule,
    FarmModule,
    CropModule,
    HarvestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
