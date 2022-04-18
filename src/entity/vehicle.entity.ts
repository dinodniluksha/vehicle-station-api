import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('vehicle')
export class Vehicle {
  @PrimaryColumn()
  id: number;
  @Column('varchar')
  make: string;
  @Column('varchar')
  model: string;
  @Column('integer')
  year: number;
  @Column('varchar')
  engineNumber: string;
}
