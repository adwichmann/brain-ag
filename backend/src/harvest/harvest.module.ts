import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest])],
  controllers: [HarvestController],
  providers: [HarvestService],
})
export class HarvestModule {}
