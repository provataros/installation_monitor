import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Mongo } from "meteor/mongo"

import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {testConfigGeneration} from "/client/lib/lib.js"

import './main.html';

var devices = new Mongo.Collection("devices");
var stations = new Mongo.Collection("stations");
var usb = new Mongo.Collection("usb");
var history = new Mongo.Collection("history");
Mongo._devices = devices;
Mongo._stations = stations;
Mongo._usb = usb;
Mongo._history = history;

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
  Meteor.subscribe("history");
  Meteor.subscribe("todo");

  Session.set("menu","search");
  Session.modal = {};
  Session.modal.no = function(){};
  Session.set("multiSelected",{})

  var displayColumns = localStorage.getItem("displayColumns")
  if (!displayColumns){
    localStorage.setItem("displayColumns",
      JSON.stringify({
        no : true,
        device_type : true,
        lsam_id : true,
        install_date : true,
        schedule_date : true,
        register_date : true,
        agency : true,
        hw_id : true,
        service_id : true,
        station_name : true,
        sam_tracking : true,
        hw_status : true,
        sw_status : true,
      })
    )
  }
  var config_3g = localStorage.getItem("3g_settings")
  if (!config_3g){
    localStorage.setItem("3g_settings",
      JSON.stringify({
        ip : "10.230.40.",
        subnet : "255.255.255.0",
        gateway : "10.230.40.1"
      })
    )
  }
  var settings = localStorage.getItem("config")
  if (!settings){
    localStorage.setItem("config",
      JSON.stringify({
        "3g_subnet" : "10.230.40"
      })
    )
  }
  Session.set("displayColumns",JSON.parse(localStorage.getItem("displayColumns")))
  Session.set("config",JSON.parse(localStorage.getItem("config")));
  testConfigGeneration();
  GoogleMaps.load({ v: '3', key: 'AIzaSyDh8emWbWLB48ccOT_is8BMVDM26b3TH3k'});
});
