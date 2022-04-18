import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [DatabaseModule, VehiclesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
