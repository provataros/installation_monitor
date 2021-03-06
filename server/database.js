import { Mongo } from 'meteor/mongo';
import {Initialize} from "/server/init"
import {FixNetwork} from "/server/init"
import {createConfigsBatch} from "./lib.js"
import {createConfigsBatch3G} from "./lib.js"
import {spawn} from 'child_process';
import { Session } from 'meteor/session'

var Future = Npm.require('fibers/future');

Mongo._devices = new Mongo.Collection("devices");
Mongo._stations = new Mongo.Collection("stations");
Mongo._lsams = new Mongo.Collection("lsams");
Mongo._history = new Mongo.Collection("history");
Mongo._todo = new Mongo.Collection("todo");
Mongo._labels = new Mongo.Collection("labels");
Mongo._glossary = new Mongo.Collection("glossary");
Mongo._teams = new Mongo.Collection("teams");

var fs = require('fs')

Meteor.publish("labels",function(){
  return Mongo._labels.find({});
})
Meteor.publish("glossary",function(){
  return Mongo._glossary.find({});
})
Meteor.publish("todo",function(){
  return Mongo._todo.find({});
})
Meteor.publish("devices",function(){
  return Mongo._devices.find({});
})
Meteor.publish("stations",function(){
  return Mongo._stations.find({});
})
Meteor.publish("history",function(){
  return Mongo._history.find({});
})
Meteor.publish("teams",function(){
  return Mongo._teams.find({});
})
Meteor.startup(function(){
})
Meteor.publish("usernames", function () {
    return Meteor.users.find({},
        {fields: {'_id': 1, 'username': 1}});
});

Meteor.methods({
  find : function(){
    //console.log(Mongo._devices.find({}).fetch());
  },
  register_user : function(user,pass){
    if (user && pass){
      var result = Accounts.createUser({username : user,password : pass})
      console.log("User " + user + " created with ID : " +result)
      if (result)return true;
      return false;
    }
    return "Please fill the fields"
  },
  save : function(id,data){
    try {
      if (!Meteor.userId()){
        return {error : {err : "Not logged in!"}}
      }
      if (data.lsam_id){
        var f = Mongo._lsams.find({id : data.lsam_id}).count();
        if (f!=1){
          return {error : {err : "LSAM does not exist!"}}
        }

      }

      var fields = {};
      for (var k in data){
          if (data.hasOwnProperty(k)) {
               fields[k] = 1;
          }
      }
      fields._id = 0;
      var f = Mongo._devices.findOne({_id : id },{fields : fields});
      data.updatedAt = moment().format("YYYYMMDDHHmmss");
      data.updatedFrom = Meteor.user().username;
      var result =  Mongo._devices.update( {_id : id },{$set : data},{upsert : true});
      delete data.updatedAt;
      delete data.updatedFrom;
      if (result)Mongo._history.insert({user : Meteor.user().username,id : id,date : moment().format("YYYYMMDDHHmmss"), data : {from : f,to : data}})
      return result;
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
      data.updatedAt = data.createdAt;
      data.updatedFrom = Meteor.user().username;
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
  insert_history : function(date,text,id){
    return Mongo._devices.update({_id : id},{$push : {history : {user : Meteor.user().username,date : date,value : text}}});
  },
  getConfigs : function(){
    var f = Mongo._devices.find({device_type : "ACIM", service_id : {"$exists" : true, "$ne" : ""}}).fetch();
    var arr = {};
    _.each(f,function(key,value){
      arr[key._id] = key;
    })
    return createConfigsBatch(arr)
  },
  getConfigs3G : function(subnet){
    var f = Mongo._devices.find({device_type : "ACIM", service_id : {"$exists" : true, "$ne" : ""}}).fetch();
    var arr = {};
    _.each(f,function(key,value){
      arr[key._id] = key;
    })
    var ss = {};
    ss["3g_subnet"] = subnet;
    return createConfigsBatch3G(arr,ss)
  },
  
  getDeviceFromNFC : function(key){
    var f = Mongo._devices.findOne({device_type : "ACIM", nfc_key : key});
    return JSON.stringify(f);
  },
  getUserFromNFC : function(key){
    var f = Mongo._users.findOne({username : "kangskim"});
    console.log(f);
    return JSON.stringify(f);
  },

  backupDatabase : function(){

      var myFuture = new Future();
      
      console.log("backup")
      const bat = spawn('cmd.exe', ['/c', 'C:\\backup\\backup.bat']);

      bat.stdout.on('data', (data) => {
        //console.log(data);
      });

      bat.stderr.on('data', (data) => {
        //console.log(data);
      });
      bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);    
        myFuture.return("done");
      });
      
      return myFuture.wait();
  },

  saveImage : function(id,data){
    if (data && id){
      var buffer = new Buffer(data,"base64")
      var timestamp = moment().format("YYYYMMDDHHmmssSSS")
      var err = fs.writeFile(process.cwd()+"../../../../../../.images/"+timestamp+".png", buffer);
      if (!err){
        var data = {};
        data.updatedAt = moment().format("YYYYMMDDHHmmss");
        data.updatedFrom = Meteor.user().username;
        var result =  Mongo._devices.update( {_id : id },{$set : data,$push : {image : {date : moment().format("YYYYMMDDHHmmss"), file : timestamp}}},{upsert : true});
        if (result)Mongo._history.insert({user : Meteor.user().username,id : id,date : moment().format("YYYYMMDDHHmmss"), data : {from : {image : "Added Image"},to : {image : timestamp}}})
      }
      else{
        //console.log(err);
      }
    }
  },
  getImages : function(data){
    var images = []
    if (data){
      for (var i=0;i<data.length;i++){
        try{
          var bitmap = fs.readFileSync(process.cwd()+"../../../../../../.images/"+data[i].file+".png");
          if (bitmap){
            images.push({error:undefined,image : new Buffer(bitmap).toString('base64')})
          }
        }
        catch(e){
          images.push({error : true});
        }
        //return new Buffer(bitmap).toString('base64');
      }
    }
    return images;
  },
  //FixNetwork : FixNetwork,

  createQuickTaskPersonal : function(data){
    Mongo._todo.insert({ user : Meteor.user().username,author : Meteor.user().username,task : data, status : "incomplete",type : "quick",created : moment().format("YYYYMMDDHHmmssSSS")})
  },
  createQuickTaskTeam : function(data){
    Mongo._todo.insert({ user : "___TEAM",author : Meteor.user().username,task : data, status : "incomplete",type : "quick",created : moment().format("YYYYMMDDHHmmssSSS")})
  },
  completeQuickTask : function(id){
    Mongo._todo.update({_id : id},{$set : {status : "complete"}})
  },
  enableQuickTask : function(id){
    Mongo._todo.update({_id : id},{$set : {status : "incomplete"}})
  },
  completeQuickTaskTeam : function(id){
    Mongo._todo.update({_id : id,author : Meteor.user().username},{$set : {status : "complete"}})
  },
  enableQuickTaskTeam : function(id){
    Mongo._todo.update({_id : id,author : Meteor.user().username},{$set : {status : "incomplete"}})
  },
  deleteTask : function(id){
    Mongo._todo.remove({_id : id})
  },
  importData : function(data){
    _.each(data,function(value,key){
        console.log({hw_id : value.hw_id},{$set : value})
        Mongo._devices.update({hw_id : value.hw_id},{$set : value},{upsert : true})
    })
  },
  requestTranslation : function(data){
    var f = Mongo._glossary.find({$or : [{search : data.text.toLowerCase()},{search : data.text.toLowerCase()}]}).fetch();
    console.log(f);
    if (f.length == 0){
      Mongo._glossary.insert(data);
      return "ok";
    }
    else return "exists";
  },
  createTerm : function(data){
    var f = Mongo._glossary.find({$or : [
      {searchtext : data.text.toLowerCase()},
      {searchtr : data.text.toLowerCase()},
      {searchtext : data.tr.toLowerCase()},
      {searchtr : data.tr.toLowerCase()}
      
    ]}).fetch();
    console.log(f);
    if (f.length == 0){
      Mongo._glossary.insert(data);
      return "ok";
    }
    else return "exists";
  },
  translate : function(data){
    Mongo._glossary.update({_id : data._id},data);
    return "ok";
  },
  saveTranslation : function(data){
    Mongo._glossary.update({_id : data._id},data);
    return "ok";
  },
  deleteTerm(data){
    Mongo._glossary.remove(data);
  },
  create_team : function(team){
    var f = Mongo._teams.findOne({name : team.name});
    if (f)return "exists";

    Mongo._teams.insert(team);
    return "success";
  },

  add_team_member : function(team,username){
    var name = Accounts.users.findOne({"username" : username});
    if (!team)return "failed";
    if (!name)return "failed";

    var f = Mongo._teams.findOne({_id : team});
    var index = f.members.indexOf(name._id);
    
    if (index == -1){
      Mongo._teams.update({_id : team},{$push : {members : name._id}});
      return "success";
    }
    else{
      return "already in group";
    }
  },




})
