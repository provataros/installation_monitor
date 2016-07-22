import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js"
import { Mongo } from "meteor/mongo"


export const construct_query = function(){
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

export const populateStations = function(agency){
  labels.station_id.options = [];
  labels.station_name.options = [];
  labels.station_id.options.push("");
  labels.station_name.options.push("");
  _.each(Mongo._stations.find({sub_agency : agency},{sort : {id : 1}}).fetch(),function(key, value){
      labels.station_id.options.push(key.id);
      labels.station_name.options.push(key.eng);
  });
}

function convert(str,length){
  var l = str.length;
  var r = length - l;
  var s = "";
  var zero = 0;
  for (var i=0;i<r;i++){
    s += zero.toString(16)+" ";
  }
  for (var i=0;i<l;i++){
    s += ""+str.charCodeAt(i).toString(16)+" ";
  }
  return s;
}

export const createConfigs = function(data){
  /*var msgid = convert("SC001",5);
  var msgv = convert("1",1);
  var msgrev = convert("0",1);
  var service_id = convert(data.service_id,10);
  var host = convert("ETS"+service_id);
  var ntp = convert(data.ntp);
  var no_if = convert(1);
  var newline = convert("") ;
  var ifnm = convert("0");
  var iftp = convert("0");
  var ip = convert(data.ip);
  var subnet = convert(data.subnet);
  var gateway = convert(data.gateway);
  var dns1 = convert(data.dns1);
  var dns2 =convert( data.dns2);
  var rfu = convert("");
*/
}
