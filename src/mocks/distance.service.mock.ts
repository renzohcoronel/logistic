export class DistanceServiceMock {

    getDistance(origin: string[], destination: string[]): Promise<any>{
        return new Promise((resolve, reject) => 2);
    }

}