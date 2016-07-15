import {Mongo} from "meteor/mongo"

import {stations} from "./stations.js"
import {lsams} from "./lsams.js"
import {devices} from "./devices.js"


function pad(num){
  var s = "00"+num;
  return s.substr(s.length-2)
}

function reset(){
  Mongo._stations.remove({});
  _.each(stations,function(a){
    Mongo._stations.insert(a);
  })

  Mongo._lsams.remove({});
  _.each(lsams,function(a){
    Mongo._lsams.insert(a);
  })

  Mongo._devices.remove({});
  _.each(devices,function(a){
    if(a.schedule_date){
      a.schedule_date = ""+moment(a.schedule_date,"DD-MMM-YY").format("YYYYMMDD");
    }
    if(a.install_date){
      a.install_date = ""+moment(a.install_date,"DD-MMM-YY").format("YYYYMMDD");
    }
    Mongo._devices.insert(a);
  })
}

export const Initialize = reset;
