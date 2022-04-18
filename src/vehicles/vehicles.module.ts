import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Vehicle } from 'src/entity/vehicle.entity';
import { UploadProcessor } from 'src/processors/upload.processor';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'upload-queue',
    }),
  ],
  controllers: [VehiclesController],
  providers: [UploadProcessor, VehiclesService],
})
export class VehiclesModule {}
