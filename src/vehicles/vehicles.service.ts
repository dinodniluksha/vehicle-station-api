import { ConsoleLogger, Injectable } from '@nestjs/common';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  HttpLink,
} from '@apollo/client';
import fetch from 'cross-fetch';

const GET_VEHICLES = gql`
  query {
    findAllVehicles {
      id
      make
      model
      engineNumber
      year
    }
  }
`;

const CREATE_VEHICLE = gql`
  mutation CreateVehicles($input: [VehicleInput!]!) {
    createVehicles(input: $input) {
      engineNumber
      id
      make
      model
      year
    }
  }
`;

const client = new ApolloClient({
  uri: 'http://localhost:3003/graphql',
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://localhost:3003/graphql', fetch }),
  credentials: 'include',
});

@Injectable()
export class VehiclesService {
  async fetchAll() {
    const results = await client.query({
      query: GET_VEHICLES,
    });

    console.log(results['data']['findAllVehicles']);
  }

  async saveRecoards(vehicles: any) {
    const results = await client.mutate({
      mutation: CREATE_VEHICLE,
      variables: {
        input: vehicles,
      },
    });
  }

  trailFunc() {
    console.log('Call service function');
  }
}
