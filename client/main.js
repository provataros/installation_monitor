import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'


import {labels} from "./labels.js"
import './main.html';

var devices = new Mongo.Collection("devices");
var stations = new Mongo.Collection("stations");
var usb = new Mongo.Collection("usb");

Mongo._devices = devices;

var status = {};


$.fn.extend({
  getVal : function(){
    var value;
    if (this.is("input[type='checkbox")){
      return ""+this.is(':checked')
    }
    else{
      return ""+this.val();
    }
  }
});

Meteor.startup(() => {
  Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
  Session.keys = {}

  Meteor.subscribe("devices");
  Meteor.subscribe("stations");

  Session.set("menu","search");

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
  "change input[type='checkbox']" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).getVal();
    Session.set(id,value);
  },
  "click #search_button" : function(){
    //Meteor.call("test","test");
  },
  "change .showbox:not(:checked)" : function(event,target){
    $(event.target).siblings(".checkboxDiv").find("input[type='hidden']").each(function(){
      Session.set(this.id,undefined)
    });
  },
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
  var urgent = Session.get("s_urgent");
  var error = Session.get("s_error");

  var from_install = Session.get("s_from_install_date")
  var until_install = Session.get("s_untl_install_date")

  var from_schedule = Session.get("s_from_schedule_date")
  var until_schedule = Session.get("s_untl_schedule_date")

  var from_register = Session.get("s_from_register_date")
  var until_register = Session.get("s_untl_register_date")

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
  if (urgent=="true"){
    flag = true;
    query.urgent = "true";
  }
  if (error=="true"){
    flag = true;
    if (!(query.$or))query.$or = [];
      query.$or.push(
        { hw_error : "true"},
        { sw_error : "true"},
      );
  }
  if (from_install != undefined && until_install != undefined){
    query.install_date = {
      $gte : from_install,
      $lte : until_install
    }
    flag = true;
  }
  if (from_schedule != undefined && until_schedule != undefined){
    query.schedule_date = {
      $gte : from_schedule,
      $lte : until_schedule
    }
    flag = true;
  }
  if (from_register != undefined && until_register != undefined){
    query.register_date = {
      $gte : from_register,
      $lte : until_register
    }
    flag = true;
  }
  if (flag)return query;
}


Template.search_results.helpers({
  results : function(){
    var query = construct_query();
    var sort = Session.get("sort");
    if (sort){
      obj = {};
      obj[sort] = Session.get("sort_order");
      sort = {sort : obj}
    }
    else{
      sort = null;
    }
    if (query){
      return sort?devices.find(query,sort):devices.find(query);
    }
  },
  isUrgent : function(){
    return this.urgent=="true"?"urgent":"";
  }
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
  },
  "change #edit_sub_agency" : function(event,target){
    populateStations(event.target.value);
    $("#edit_station_id").empty();
    $("#edit_station_name").empty();

    $.each(labels.station_id.options,function(key,value){
      $("#edit_station_id").append($("<option></option>").attr("value", value).text(value));
    })
    $.each(labels.station_name.options,function(key,value){
      $("#edit_station_name").append($("<option></option>").attr("value", value).text(value));
    })
    $("#edit_station_id")[0].selectedIndex = 0;
    $("#edit_station_name")[0].selectedIndex = 0;
  },
});

Template.search_results.events({
  "click .device_item" : function(){
    Session.set("selected_device",this._id);
    status = {};
  },
  "click .sort" : function(e){
    var sort = Session.get("sort");
    var id = e.target.id.substr(5,e.target.id.length-1);
    if (sort === id){
      Session.set("sort_order",Session.get("sort_order")*(-1));
    }
    else{
      Session.set("sort",id);
      Session.set("sort_order",-1);
    }
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
      value = $(value).getVal();
      if ((value !== that[key] || !id) && value != undefined){
        flag = true;
        fields[key] = value;
      }
    });
    console.log(flag,fields);
    if (flag){
    //  console.log(id);
      if (this.new){
        if (!fields.hw_id || !fields.device_type){
          alert("Please fill the mandatory fields :\nHardware ID\nDevice Type");
        }
        else{
          if (confirm('Are you sure you want to save?')) {
            var result = Meteor.call("create",fields,function(error,result){
              if (!result.error){
                var str = "Succesfully created with _id : " + result;
                alert(str);
                Session.set("selected_device",result);
              }
              else{
                alert("An error has occured while creating : " + result.error.err);
              }
            });
          }
        }
      }
      else{
        if (confirm('Are you sure you want to save?')) {
          var result = Meteor.call("save",id,fields,function(error,result){
            if (result == 1){
              var str = "Succesfully updated : \n\n";
              $.each(fields,function(key,value){
                str += labels[key].name +'\n';
              });
              alert(str.substring(0,str.length-1));
            }
            else{
              alert("An error has occured while updating : " + result.error.err);
            }
          });
        }
      }
    }
    else{
      alert("Nothing to update");
    }
  },
  "click #reset" : function(){
    var that = this;
    $(".device-input").each(function( key,value) {
        $(value).val(that[$(value).attr("id").substr(5,$(value).attr("id").length-1)])
    });
    $(".datepicker").each(function(key,value){
      var id = $(value).attr("id").substr(5,$(value).attr("id").length-1);
      if ($("#edit_"+id).val()){
        $(value).val(moment($("#edit_"+id).val(),"YYYYMMDD").format("dddd DD MMM YYYY"));
      }
      else{
        $(value).val("");
      }
    });
  },
  "click #new_acim" : function(){
    Session.set("selected_device","__new__")

  },
  "click #delete" : function(){
    if (confirm('Are you sure you want to delete this device? Hardware ID : '+this.hw_id)) {
      Meteor.call("delete",this,function(result,error){
        alert(error.error.err)
      });
    }
    else{

    }
  },
  "click #copy" : function(){
    for (var key in this) {
       if (this.hasOwnProperty(key)) {
         delete this[key];
       }
    }
    this.new = true;
    $("#edit_hw_id").val(undefined);
    $("#edit_lsam_id").val(undefined);
    $("#edit_device_id").val(undefined);
  },
  "click #usb" : function(){
    Session.set("menu","usb");
  },
  "click #search" : function(){
    Session.set("menu","search");
  }
})

function populateStations(agency){
  labels.station_id.options = [];
  labels.station_name.options = [];
  labels.station_id.options.push("");
  labels.station_name.options.push("");
  _.each(stations.find({sub_agency : agency},{sort : {id : 1}}).fetch(),function(key, value){
      labels.station_id.options.push(key.id);
      labels.station_name.options.push(key.name);
  });
}


Template.registerHelper("device",function(){
  var id = Session.get("selected_device");
  if (id == "__new__"){
    //console.log("hahe");
    return {new : true}
  }
  else{
    var f = devices.findOne({_id : id});
    if (!f){
      Session.set("selected_device",null);
    }
    else{
      return f;
    }
  }

})


Template.registerHelper("menu",function(){
  return Session.get("menu");
})

Template.registerHelper("usb_list",function(){
  return usb.find({})
})

Template.registerHelper("isMenu",function(value){
  return this == value;
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

Template.registerHelper('args', function(a,b,c,d,e) {
  return arguments
});


Template.date.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(this.find(".device-input")).val() ,
    format : "dddd DD MMM YYYY"
  },function(date){
    $(that.find(".device-input")).val(date);
  });
})


Template.searchDate.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(that.find(".search_input")).val() ,
    format : "dddd DD MMM YYYY"
  },function(date){
    $(that.find(".search_input")).val(date);
    var id = $(that.find(".search_input")).attr("id");
    Session.set(id,date);
  });
})
