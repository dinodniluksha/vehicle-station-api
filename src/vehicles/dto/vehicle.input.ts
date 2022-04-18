import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VehicleInput {
    @Field()
    id: number;
    @Field()
    make: string;
    @Field()
    model: string;
    @Field()
    year: number;
    @Field()
    engineNumber: string;
}