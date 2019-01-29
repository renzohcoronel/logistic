export class DistanceServiceMock {

    getDistance(origin: string[], destination: string[]){
        return Math.floor((Math.random() * 10) + 1);
    }

}