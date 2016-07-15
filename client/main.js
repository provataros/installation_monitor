import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'


import {labels} from "./labels.js"
import './main.html';

var devices = new Mongo.Collection("devices");
var stations = new Mongo.Collection("stations");
Mongo._devices = devices;

var status = {};

Meteor.startup(() => {
  Session.set("s_hwid","");
  Session.set("s_deid","");
  Session.set("s_said","");
  Session.set("s_lsam","");
  Session.set("s_device_type","");
  Session.set("s_agency","");


  Meteor.subscribe("devices")
  Meteor.subscribe("stations")

});


Template.search_bar.events({
  "keypress .search_input" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).val()+String.fromCharCode(event.charCode);
    Session.set(id,value);
  },
  "keyup .search_input" : function(event,target){
    if (event.key != "Backspace")return;
    var id = $(event.target).attr("id");
    var value = $(event.target).val();
    Session.set(id,value);
  },
  "change select" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).val();
    Session.set(id,value);
  },
  "click #search_button" : function(){
    //Meteor.call("test","test");
  }
});

function get_hwid(){
  return
}


function construct_query(){
  var hardware = Session.get("s_hwid");
  var device = Session.get("s_deid");
  var account =  Session.get("s_said");
  var lsam = Session.get("s_lsam");
  var type = Session.get("s_device_type");
  var agency = Session.get("s_agency");
  var sw_status = Session.get("s_sw_status");
  var flag = false;
  var query = {};
  if (hardware){
    flag = true;
    query.hw_id = {$regex: ".*" + hardware + ".*"};
  }
  if (device){
    flag = true;
    query.device_id = {$regex: ".*" + device + ".*"};
  }
  if (account){
    flag = true;
    query.service_id = {$regex: ".*" + account + ".*"};
  }
  if (lsam){
    flag = true;
    query.lsam_id = {$regex: ".*" + lsam + ".*"};
  }
  if (type){
    flag = true;
    query.device_type = {$regex: ".*" + type + ".*"};
  }
  if (agency){
    flag = true;
    query.agency = {$regex: ".*" + agency + ".*"};
  }
  if (sw_status){
    flag = true;
    query.sw_status = {$regex: ".*" + sw_status + ".*"};
  }
  if (flag)return query;
}


Template.search_results.helpers({
  results : function(){
    var query = construct_query();
    if (query){
    //  console.log(devices.find(query).fetch());
      return devices.find(query);
    }
  },
})

Template.dropdown.events({
  "change #edit_station_name" : function(event,target){
    $("#edit_station_id")[0].selectedIndex = event.target.selectedIndex;
  },
  "change #edit_station_id" : function(event,target){
    $("#edit_station_name")[0].selectedIndex = event.target.selectedIndex;
  },
  "change select" : function(e,t){
    $(e.target).css("color",$(e.target.options[e.target.selectedIndex]).css("color"))
  }
});

Template.search_results.events({
  "click .device_item" : function(){
    Session.set("selected_device",this._id);
    status = {};
  },
})

Template.side_panel.events({
  "click #back" : function(){
    Session.set("selected_device",null);
  },
  "click #save" : function(){
    var id = this._id;
    var flag = false;
    var fields = {};
    var that = this;
    $.each( $(".device-input"), function( key, value ) {
      key = $(value).attr("id").substr(5,$(value).attr("id").length-1)
      value = $(value).val();
      if (value !== that[key] && value != undefined){
        flag = true;
        fields[key] = value;
      }
    });
    if (flag){
    //  console.log(id);
      var result = Meteor.call("save",id,fields,function(error,result){
        if (result == 1){
          var str = "Succesfully updated : \n\n";
          $.each(fields,function(key,value){
            str += labels[key].name +'\n';
          });
          alert(str.substring(0,str.length-1));
        }
        else{
          alert("An error has occured while updating");
        }
      });
    }
    else{
      alert("Nothing to update");
    }
  },
  "click #reset" : function(){
    $.each( this, function( key, value ) {
      if (key === "_id")return;
        $("#edit_"+key).val(value);
    });
  },
})

console.log($.datepicker);


Template.registerHelper("device",function(){
    return devices.findOne({_id : Session.get("selected_device")})
})

Template.registerHelper("evenrow",function(value){
  return value%2 === 0?"even":"odd";
})
Template.registerHelper("save_status",function(value){
  status[value.name] = value.value;
})

Template.registerHelper("selected_device",function(value){
  return Session.get("selected_device");
})

Template.registerHelper("debug",function(value){
  console.log(value);
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

Template.registerHelper('toDate',function(obj){
  if (!obj)return "";
  var date = moment(obj,"YYYYMMDD");
  if (date.isValid())  return date.format("dddd DD MMMM YYYY");
  return "";//(new Date(obj)).toLocaleString("",date_options);
})

Meteor.subscribe("stations", function(){
  labels.station_id.options.push("");
  labels.station_name.options.push("");
  _.each(stations.find({},{sort : {id : 1},fields: {_id : 0}}).fetch(),function(key, value){
      labels.station_id.options.push(key.id);
      labels.station_name.options.push(key.name);
    });
});

Template.registerHelper('lower', function(str) {
  return str?str.toLowerCase().split(' ').join('_'):"";
});

Template.registerHelper('fromSession', function(id) {
  return Session.get(id);
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

Template.date.onRendered(function(){
  console.log(this.$('.datetimepicker').datetimepicker({format : "dddd DD MMM YYYY"}));
})
