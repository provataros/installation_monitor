import {Mongo} from "meteor/mongo"

import {stations} from "./stations.js"
import {lsams} from "./lsams.js"
import {devices} from "./devices.js"


function pad(num){
  var s = "00"+num;
  return s.substr(s.length-2)
}
function resetStations(){
  Mongo._stations.remove({});
  _.each(stations,function(a){
    try{
      Mongo._stations.update(a,{$set : a},{upsert : true});
    }
    catch(e){
      console.log(e.err);
      return
    }
  })
}

function resetLSAM(){
  Mongo._lsams.remove({});
  _.each(lsams,function(a){
    try{
      Mongo._lsams.insert(a);
    }
    catch(e){
      console.log(e.err)
      return
    }
  })
}

function resetDevices(){
  Mongo._devices.remove({});
  var error_flag = false;
  console.log("IMPORTING START-------------")
  _.each(devices,function(a){
    try{
      console.log(a.schedule_date,a.install_date,a.register_date);
      if(a.schedule_date){
        a.schedule_date = ""+moment(a.schedule_date,"MM/DD/YYYY").format("YYYYMMDD");
      }
      if(a.install_date){
        a.install_date = ""+moment(a.install_date,"MM/DD/YYYY").format("YYYYMMDD");
      }
      if(a.register_date){
        a.register_date = ""+moment(a.register_date,"MM/DD/YYYY").format("YYYYMMDD");
      }
      a.createdAt = moment().format("YYYYMMDDHHmmss");
      Mongo._devices.insert(a);
    }
    catch(e){
      console.log(e.err);
      error_flag = true;
      return
    }
  })
  console.log("IMPORTING END-------------")
  console.log("ERRORS : " + error_flag)
}

function resetAll(){
  resetStations();
}

export const Initialize = resetAll;
export const FixNetwork = function(){
  Mongo._devices.find({}).forEach(function(doc){
    doc.host1 = doc.host1.replace(/ /g ,"").replace(/\//g,":");
    doc.host2 = doc.host2.replace(/ /g ,"").replace(/\//g,":");
    doc.host3 = doc.host3.replace(/ /g ,"").replace(/\//g,":");
    Mongo._devices.update({_id : doc._id},doc);
  })
}
