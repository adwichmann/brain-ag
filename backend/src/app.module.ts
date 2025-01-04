import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './utils/config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FarmModule } from './farm/farm.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
