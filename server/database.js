import { Mongo } from 'meteor/mongo';
import {Initialize} from "/server/init"
import {FixNetwork} from "/server/init"


Mongo._devices = new Mongo.Collection("devices");
Mongo._stations = new Mongo.Collection("stations");
Mongo._lsams = new Mongo.Collection("lsams");




Meteor.publish("devices",function(){
  return Mongo._devices.find({});
})
Meteor.publish("stations",function(){
  return Mongo._stations.find({});
})
Meteor.startup(function(){
  if (false)console.log(_.each(stations_obj,function(doc){
    Mongo._stations.insert(doc);
  }));
})

Meteor.methods({
  find : function(){
    //console.log(Mongo._devices.find({}).fetch());
  },
  save : function(id,data){
    try {
      if (data.lsam_id){
        var f = Mongo._lsams.find({id : data.lsam_id}).count();
        if (f!=1){
          return {error : {err : "LSAM does not exist!"}}
        }

      }
      data.updatedAt = moment().format("YYYYMMDDHHmmss");
      return Mongo._devices.update( {_id : id },{$set : data},{upsert : true});
    }
    catch(err) {
      return {error : err}
    }
  },
  create : function(data){
    try {
      if (data.lsam_id != ""){
        var f = Mongo._lsams.find({id : data.lsam_id}).count();
        if (f!=1){
          return {error : {err : "LSAM does not exist!"}}
        }
      }
      data.createdAt = moment().format("YYYYMMDDHHmmss");
      return Mongo._devices.insert(data);
    }
    catch(err) {
      return {error : err}
    }
  },
  delete : function(data){
    try {
      if (!data._id){
        return {error : {err : "No _id!"}}
      }
      return Mongo._devices.remove(data);
    }
    catch(err) {
      return {error : err}
    }
  },
  resetAll : function(){
    Initialize();
  },
  FixNetwork : FixNetwork,
})
