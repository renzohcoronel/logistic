import { Injectable } from '@nestjs/common';

var distance = require('google-distance-matrix');
console.log(` DISTANCE KEY ${process.env.GOOGLE_CLIENT_KEY}`);
distance.key(process.env.GOOGLE_CLIENT_KEY);

@Injectable()
export class DistanceService {
  constructor() {}

  getDistance(origin: string[], destination: string[]) {
    return new Promise<any>(async (resolve, reject) => {
      await distance.matrix(origin, destination, (error, distances) => {
        if (error) {
          console.log(`[DistanceService ] Error ${error}`);
          return reject(error);
        }
    
        console.log(distances);
        
        if (distances.status == 'OK') {
          if (distances.rows[0].elements[0].status == 'OK') {
            console.log(
              'Distance from ' +
                origin +
                ' to ' +
                destination +
                ' is ' +
                distance,
            );
            resolve(distances.rows[0].elements[0].distance.text);
          }
        } else {
          resolve(0);
        }
      });
    });
  }
}
