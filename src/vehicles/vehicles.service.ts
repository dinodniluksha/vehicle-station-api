import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleInput } from './dto/vehicle.input';
import { Like } from 'typeorm';
import { VehiclesResponse } from './dto/vehicles.response';
import { Socket } from 'socket.io';
import { VehiclesGateway } from './gateway/vehicles.gateway';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    private readonly vehiclesGateway: VehiclesGateway,
  ) {}

  io: Socket;

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }
  async findAllPagi(
    keyWord: string,
    limit: number,
    offset: number,
  ): Promise<VehiclesResponse> {
    let pushCount: number;
    let resultRack: Vehicle[] = [];
    let dataRack: Vehicle[] = [];

    dataRack = await this.vehicleRepository.find({
      order: { id: 'ASC' },
      where: { model: keyWord != '' ? Like(`${keyWord}%`) : Like('%') },
    });
    const dataCount = dataRack.length;

    if (offset + limit < dataCount) {
      pushCount = limit;
    } else {
      pushCount = dataCount - offset;
    }
    for (let i = 0; i < pushCount; i++) {
      resultRack.push(dataRack[i + offset]);
    }
    //return await this.vehicleRepository.find();
    return { totalCount: dataCount, filteredVehicles: resultRack };
  }

  async createVehicle(vehicle: VehicleInput) {
    const newVehicle = await this.vehicleRepository.create(vehicle);
    await this.vehicleRepository.save(newVehicle);
    this.vehiclesGateway.socket.emit('notification', 'Created Successfully');
    return newVehicle;
  }

  async createVehicles(vehicles: any) {
    await this.vehicleRepository.clear();
    await this.vehicleRepository.save(vehicles);
    this.vehiclesGateway.socket.emit(
      'notification',
      'Table Created Successfully',
    );
    return vehicles;
  }

  async update(id: number, vehicle: VehicleInput) {
    await this.vehicleRepository.update(id, vehicle);
    this.vehiclesGateway.socket.emit('notification', 'Updated Successfully');
    let item = await this.vehicleRepository.findOne({
      where: {
        id,
      },
    });
    return item;
  }

  async destroyVehicle(id: number) {
    let item = await this.vehicleRepository.findOne({
      where: {
        id,
      },
    });
    await this.vehicleRepository.delete({ id });
    this.vehiclesGateway.socket.emit('notification', 'Deleted Successfully');
    return item;
  }
}
