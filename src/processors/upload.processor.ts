import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Repository } from 'typeorm';
import { Vehicle } from '../entity/vehicle.entity';

@Processor('upload-queue')
export class UploadProcessor {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    private vehicleService: VehiclesService,
  ) {}

  /**
   * process csv file
   * @param job
   * @returns
   */
  @Process('csv')
  async handleCsvFiles(job: Job) {
    const vehicles = [];
    const csv = require('csvtojson');
    const csvFilePath = process.cwd() + '/' + job.data['file']['path'];
    console.log(csvFilePath);
    const vehicleArray = await csv().fromFile(csvFilePath);
    console.log(vehicleArray);
    // await this.vehicleRepository.clear();
    //await this.vehicleRepository.save(vehicleArray);
    for (let i = 0; i < vehicleArray.length; i++) {
      for (var key in vehicleArray[i]) {
        if (key == 'id' || key == 'year') {
          vehicleArray[i][key] = parseInt(vehicleArray[i][key], 10);
        }
      }
      console.log(vehicleArray[i]);
      vehicles.push(vehicleArray[i]);
    }
    console.log('Time to Completing DB writting...');
    console.log(vehicles);
    await this.vehicleService.saveRecoards(vehicles);
    //this.vehicleService.fetchAll();
  }
}
