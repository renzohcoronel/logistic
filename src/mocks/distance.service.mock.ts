export class DistanceServiceMock {

    async getDistance(origin: string[], destination: string[]){
        return new Promise((resolve, reject) => resolve(2));
    }

}