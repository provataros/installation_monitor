import { Mongo } from 'meteor/mongo';

Meteor.methods({
  fixIP : function(){
    return false;
    Mongo._devices.find({gateway : "10.232.224.1"}).forEach(function(doc){
      var ip = doc.ip.split(".");
      var gateway = ip[0]+"."+ip[1]+"."+ip[2]+".1";
      doc.gateway = gateway;
      Mongo._devices.update({_id : doc._id},doc);
    })
  }
})
