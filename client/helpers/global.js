import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"

Template.registerHelper("device",function(){
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


Template.confirm.events({
  "click #yes"(){
    Session.modal.yes();
    Session.set("modal",undefined);
  },
  "click #no"(){
    Session.modal.no();
    Session.set("modal",undefined);
  }
})

Template.alert.events({
  "click #ok"(){
    Session.set("alert",undefined);
  },
})

Template.registerHelper("menu",function(){
  return Session.get("menu");
})

Template.registerHelper("modal",function(){
  return Session.get("modal");
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

Template.registerHelper("usb_list",function(){
  return Mongo._usb.find({})
})

Template.registerHelper("isMenu",function(value){
  return this == value;
})

Template.registerHelper("displayColumn",function(col){
  return (Session.get("displayColumns"))[col]
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


Template.registerHelper('populateStations',function(){
  populateStations(this.sub_agency);
});

Template.registerHelper('lower', function(str) {
  return str?str.toLowerCase().split(' ').join('_'):"";
});

Template.registerHelper('fromSession', function(id) {
  return Session.get(id);
});

Template.registerHelper('fromSessionP', function(id) {
  return Session.get("s_"+id);
});

Template.registerHelper('selected_type', function(id) {
  return Session.get("s_device_type")===id?"selected":"";
});

Template.registerHelper('selected_sw_status', function(id) {
  return Session.get("s_sw_status")===id?"selected":"";
});


Template.registerHelper('selected_agency', function(id) {
  return Session.get("s_agency")===id?"selected":"";
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
