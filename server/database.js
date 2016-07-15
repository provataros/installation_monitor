import { Mongo } from 'meteor/mongo';
import {Initialize} from "/server/init"

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
    var f = Mongo._devices.update( {_id : id },{$set : data},{upsert : true});
    //console.log(f);
    return f;
  },
  resetAll : function(){
    Initialize();
  }
})
