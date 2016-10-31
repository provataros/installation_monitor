import {Mongo} from "meteor/mongo";

export const labels = {
    no : {
      name : "No",
      group : "misc",
    },
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
      options : [],
    },
    sw_status : {
      name : "Software Installation Status",
      type : "dropdown",
      group : "software",
      options : []
    },
    label : {
      name : "Hardware Label",
      group : "hardware",
    },
    agency : {
      name : "Agency",
      group : "agency",
      type : "dropdown",
      options : []
    },
    sub_agency : {
      name : "Sub Agency",
      group : "agency",
      type : "dropdown",
      options : []
    },
    
    nfc_key : {
      name : "Keys Serial",
      group : "keys",
    },
    alarm_key : {
      name : "Alarm Serial",
      group : "keys",
    },
    device_type : {
      name : "Device Type",
      group : "hardware",
      type : "dropdown",
      options : []
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
    keys_delivered : {
      name : "Keys Delivered",
      group : "",////////////////////////
      type : "checkbox"
    },
    keys_comments : {
      name : "Comments",
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
      type : "dropdown",
      options : []
    },
    sw_version : {
      name : "Software Version",
      group : "software",////////////////////////
      type : "dropdown",
      options : []
    },
    install_date : {
      name : "Installation Date",
      type : "date",
      group : "location",////////////////////////
    },
    schedule_date : {
      name : "Schedule Date",
      type : "date",
      group : "location",////////////////////////
    },
    register_date : {
      name : "Register Date",
      type : "date",
      group : "location",////////////////////////
    },
    urgent : {
      name : "Urgent",
      type : "checkbox",
      group : "misc",////////////////////////
    },
    hw_error : {
      name : "Hardware Error",
      type : "checkbox",
      group : "misc",////////////////////////
    },
    sw_error : {
      name : "Software Error",
      type : "checkbox",
      group : "misc",////////////////////////
    },
  };

Meteor.startup(() => {
  
  Meteor.subscribe("labels",{
    onReady : function(){
      labels.hw_status.options = Mongo._labels.findOne({id : "hw_status"}).options;
      labels.sw_status.options = Mongo._labels.findOne({id : "sw_status"}).options;
      labels.agency.options = Mongo._labels.findOne({id : "agency"}).options;
      labels.sub_agency.options = Mongo._labels.findOne({id : "sub_agency"}).options;
      labels.device_type.options = Mongo._labels.findOne({id : "device_type"}).options;
      labels.sam_tracking.options = Mongo._labels.findOne({id : "sam_tracking"}).options;
      labels.sw_version.options = Mongo._labels.findOne({id : "sw_version"}).options;
    }
  });
});