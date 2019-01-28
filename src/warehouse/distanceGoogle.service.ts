import { Injectable } from '@nestjs/common';

var distance = require('google-distance-matrix');
console.log(` DISTANCE KEY ${process.env.GOOGLE_CLIENT_KEY}`)
distance.key(process.env.GOOGLE_CLIENT_KEY);

@Injectable()
export class DistanceService {

    constructor(){
            
    }

    getDistance(origin: string[], destination: string[]){
        console.log("[DistanceService]");
        return  new Promise<any>((resolve, reject)=>{
            distance.matrix(origin,destination, (error, distances)=>{
                console.log("DISTANCES ", distances);
                if (error) {
                    console.log(`[DistanceService ] Error ${error}`);
                    return reject(error);
                }
                if(!distances) {
                   return resolve(null);
                }
                if (distances.status == 'OK') {
                    
                    console.log("[DistanceService]: ", distances);

                    for (var i=0; i < origin.length; i++) {
                        for (var j = 0; j < destination.length; j++) {
                            var origin = distances.origin_addresses[i];
                            var destination = distances.destination_addresses[j];
                            if (distance.rows[0].elements[j].status == 'OK') {
                                var distance = distances.rows[i].elements[j].distance.text;
                                console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                                resolve(distance);
                            } else {
                                console.log(destination + ' is not reachable by land from ' + origin);
                                return resolve(null);
                            }
                        }
                    }
                } 
            });
        });
        
        
    }
}