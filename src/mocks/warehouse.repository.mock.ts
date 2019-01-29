export class RespositoryWarehouse {

    find(){
        return [
            {id: 2, city: 'Buenos Aires', maxLimit:200, isDelayedAllow:false, packages:[]},
            {id: 3, city: 'La Plata', maxLimit:100, isDelayedAllow:false, packages:[]},
          ]
    }
}