import { Injectable, Logger } from '@nestjs/common';

import * as distance from 'google-distance-matrix';
distance.key(process.env.GOOGLE_CLIENT_KEY);

@Injectable()
export class DistanceService {

  private readonly logger = new Logger(DistanceService.name);
  d: any;

  constructor() {
    this.d = distance;
  }

  async getDistance(origin: string[], destination: string[]) {
    return new Promise<any>(async (resolve, reject) => {
      await this.d.matrix(origin, destination, (error, distances) => {
        if (error) {
          this.logger.log(`Error ${error}`);
          return reject(error);
        }
        if (distances.status === 'OK') {
          if (distances.rows[0].elements[0].status === 'OK') {
            resolve(distances.rows[0].elements[0].distance.value);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
}
