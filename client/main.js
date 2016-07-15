import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
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

Template.device.events({
  "click #back" : function(){
    Session.set("selected_device",null);
  },
  "click #save" : function(){
    //console.log(this);
    var id = this._id;
    var flag = false;
    var fields = {};
    $.each( this, function( key, value ) {
      if (key === "_id")return;
      if (value !== $("#edit_"+key).val() && $("#edit_"+key).val() != undefined){
        flag = true;
        fields[key] = $("#edit_"+key).val();
      }
    });
    if (flag){
    //  console.log(id);
      var result = Meteor.call("save",id,fields);
      console.log(result);
      if (result == 1){
      //  console.log(result,id);
        var str = "Succesfully updated : \n\n";
        $.each(fields,function(key,value){
          str += labels[key].name +'\n';
        });
        alert(str.substring(0,str.length-1));
      }
      else{
        alert("An error has occured while updating");
      }
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

Template.device.helpers({
  "device" : function(){
    return devices.findOne({_id : Session.get("selected_device")})
  },
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


var labels = {
  hw_comments : {
    name : "Hardware Comments",
    group : "comments",
  },
  sw_comments : {
    name : "Software Comments",
    group : "comments",
  },
  agency_comments : {
    name : "Agency Comments",
    group : "comments",
  },
  misc_comments : {
    name : "Miscelaneous Comments",
    group : "comments",
  },
  hw_id : {
		name : "Hardware ID",
    group : "hardware",
	},
  device_id : {
		name : "Device ID",
    group : "hardware",
	},
  agent_id : {
		name : "Agent ID",
    group : "agency",
	},
  service_id : {
		name : "Service Account ID",
    group : "software",
	},
  feeset_id : {
		name : "Feeset ID",
    group : "software",
	},
  lsam_id : {
		name : "LSAM ID",
    group : "hardware",
	},
  hw_status : {
		name : "Hardware Installation Status",
    type : "dropdown",
    group : "hardware",
    options : [
      "",
      "Not Done",
      "Done",
    ]
	},
  sw_status : {
		name : "Software Installation Status",
    type : "dropdown",
    group : "software",
    options : [
      "",
      "Operating System Update",
      "Firmware Update",
      "Testing",
      "Done",
    ]
	},
  label : {
		name : "Hardware Label",
    group : "hardware",
	},
  agency : {
		name : "Agency",
    group : "agency",
    type : "dropdown",
    options : [
      "OASA",
      "STASY",
      "OSY",
      "TRAINOSE",
    ]
	},
  sub_agency : {
		name : "Sub Agency",
    group : "agency",
    type : "dropdown",
    options : [
      "Tram",
      "Metro",
      "Suburban",
      "Bus",
    ]
	},
  device_type : {
		name : "Device Type",
    group : "hardware",
    type : "dropdown",
    options : [
      "ACIM",
      "TIT",
      "CIT",
      "PCRS",
      "PSCCS",
      "Gate",
      "OVMC",
    ]
	},
  firmware_type : {
		name : "Firmware Type",
    group : "software",
	},
  supervisor : {
		name : "Supervisor",
    group : "agency",
	},
  hp_number : {
		name : "HP Number",
    group : "agency",
	},
  station_id : {
		name : "Station ID",
    group : "location",
    type : "dropdown",
    options : []
	},
  station_name : {
		name : "Station Name",
    group : "location",
    type : "dropdown",
    options : []
	},
  line : {
		name : "Line",
    group : "location",
	},
  location : {
		name : "Installation Location",
    group : "location",
	},
  ip : {
		name : "Device IP",
    group : "network",
	},
  subnet : {
		name : "Subnet",
    group : "network",
	},
  ntp : {
		name : "NTP Server",
    group : "network",
	},
  gateway : {
		name : "Gateway",
    group : "network",
	},
  dns1 : {
		name : "DNS 1",
    group : "network",
	},
  dns2 : {
		name : "DNS 2",
    group : "network",
	},
  host1 : {
		name : "Host 1 (OASA)",
    group : "network",
	},
  host2 : {
		name : "Host 2",
    group : "network",
	},
  host3 : {
		name : "Host 3",
    group : "network",
	},
  swd : {
		name : "Software Delivery Server (swd)",
    group : "network",
	},
  operator_name : {
		name : "Operator Name",
    group : "",////////////////////////
	},
  operator_id : {
		name : "Operator ID",
    group : "",////////////////////////
	},
  operator_card : {
		name : "Operator Card",
    group : "",////////////////////////
	},
  status_of_installation : {
		name : "Installation Status",
    group : "comments",////////////////////////
	},
  sam_tracking : {
		name : "SAM Location",
    group : "comments",////////////////////////
	},
  sw_version : {
		name : "Software Version",
    group : "software",////////////////////////
	},
  install_date : {
		name : "Installation Date",
    group : "location",////////////////////////
	},
  schedule_date : {
		name : "Schedule Date",
    group : "location",////////////////////////
	},
}
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
