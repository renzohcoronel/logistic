export class DistanceServiceMock {

    getDistance(origin: string[], destination: string[]): Promise<any>{
        return new Promise((resolve, reject) => Math.floor((Math.random() * 3) + 1));
    }

}