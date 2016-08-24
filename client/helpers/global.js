import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"
import {save_history} from "/client/lib/lib.js"
import {construct_query} from "/client/lib/lib.js"

Template.registerHelper("retail",function(){
  var id = Session.get("selected_device");
  if (id == "__new__"){
    //console.log("hahe");
    return {new : true}
  }
  else{
    var f = Mongo._devices.findOne({_id : id});
    if (!f){
      Session.set("selected_device",null);
    }
    else{
      return f;
    }
  }
})


Template.body.helpers({
  currentUser : function(){
    return Meteor.userId();
  }
})
Template.body.helpers({
  isRegister : function(){
    return Session.get("register");
  }
})



Template.registerHelper("menu",function(){
  return Session.get("menu");
})

Template.registerHelper("modal",function(){
  return Session.get("modal");
})
Template.registerHelper("getChangeHistory",function(id){
  return Mongo._history.find({id : id},{sort: {date: -1}})
})
Template.registerHelper("popup",function(){
  return Session.get("popup");
})
Template.registerHelper("settings",function(){
  return Session.get("settings");
})
Template.registerHelper("alert",function(){
  return Session.get("alert");
})
Template.registerHelper("focus",function(){
  $("#"+this.focus).focus();
});

Template.registerHelper("isVisible",function(col){
  return (Session.get("displayColumns"))[col]?"checked":""
});
Template.registerHelper("getConfig",function(col){
  return Session.get("config")[col]
});

Template.registerHelper("usb_list",function(){
  return Mongo._usb.find({})
})

Template.registerHelper("isMenu",function(value){
  return this == value;
})
Template.registerHelper("reverse",function(value){
  if (!value) return null;
  return $.merge([],value).reverse();
})

Template.registerHelper("evenrow",function(value){
  return value%2 === 0?"even":"odd";
})

Template.registerHelper("save_status",function(value){
  status[value.name] = value.value;
})

Template.registerHelper("dateTime",function(value){
  if (value)return moment(value,"YYYYMMDDHHmmss").format("DD MMMM YYYY  HH:mm:ss")
})

Template.registerHelper("selected_device",function(value){
  return Session.get("selected_device");
})

Template.registerHelper("debug",function(value){
  console.log(value);
})

Template.registerHelper("count",function(value){
  return value.count();
})

Template.registerHelper('toArray',function(obj,group){
    var result = [];
    for (var key in obj) {
      if (key === "_id")continue;
      if (labels[key].group ===group)result.push({name:key,value:obj[key]});
    }
    return result;
});

Template.registerHelper('keys',function(obj){
    var result = [];
    var f = obj.from;
    var t = obj.to;
    for (var key in f){
      if (key != "_id")result.push({key:key,from:f[key],to : t[key]});
    }
    return result;
});

Template.registerHelper('field_label',function(obj){
    return labels[obj]?labels[obj].name:obj;
});

Template.registerHelper('isChecked',function(obj){
    return this.value=="true"?"checked":""
});

Template.registerHelper('isCheckedSessionB',function(obj){
    return Session.get(obj)=="true"?true:false
});

Template.registerHelper('isCheckedSession',function(obj){
    return Session.get(obj)=="true"?"checked":""
});

Template.registerHelper('field_type',function(obj){
    return labels[obj].type?labels[obj].type : "text";
});

Template.registerHelper('field_options',function(obj){
    return labels[obj].options;
});

Template.registerHelper('selected_option',function(n1,n2){
    return n1===n2?"selected":"";
});

Template.registerHelper('toObject',function(key,obj){
  return {name : key,value : obj[key]}
});

Template.registerHelper('lower', function(str) {
  return str?str.toLowerCase().split(' ').join('_'):"";
});

Template.registerHelper('fromSession', function(id) {
  return Session.get(id);
});

Template.registerHelper('notification', function(id) {
  return Session.get("notification");
});


Template.registerHelper('toDate', function(id) {
  return id?moment(id,"YYYYMMDD").format("DD/MM/YY"):""
});

Template.registerHelper('toDate2', function(id) {
  return id?moment(id,"YYYYMMDDHHmmss").format("DD/MM/YY HH:mm:ss"):""
});

Template.registerHelper('args', function(a,b,c,d,e) {
  return arguments
});
