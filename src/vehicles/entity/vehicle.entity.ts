import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('vehicle')
export class Vehicle {
  @Field()
  @PrimaryColumn()
  id: number;
  @Field()
  @Column('varchar')
  make: string;
  @Field()
  @Column('varchar')
  model: string;
  @Field()
  @Column('integer')
  year: number;
  @Field()
  @Column('varchar')
  engineNumber: string;
}
