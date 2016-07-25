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

  if (str==undefined || str == null || str == ""){
    throw new Error("Invalid field")
  }
  var l = str.length;
  var r = length - l;
  if (l>length){
    throw new Error("Invalid field length")
  }
  var s = [];
  var zero = 0;
  for (var i=0;i<r;i++){
    s.push(String.fromCharCode(0));
  }
  for (var i=0;i<l;i++){
    s.push(str.charAt(i));
  }
  return s;
}
var index = 0;


function append(file,data){
  for (var i=0;i<data.length;i++){
    file[index] = data[i];
    index ++;
  }
}

export const createConfigs = function(data){
  var file = [];
  index = 0;
  try{
    var msgid = append(file,convert("SC001",5));
    var msgv =  append(file,convert("1",1));
    var msgrev =  append(file,convert("0",1));
    var service_id =  append(file,convert(data.service_id,10));
    var host =  append(file,convert(("ETS"+data.service_id),50));
    var ntp =  append(file,convert(data.ntp,50));
    var no_if =  append(file,[String.fromCharCode(0),String.fromCharCode(1)]);
    var newline =  append(file,convert("\n",1) );
    var ifnm =  append(file,convert("0",1));
    var iftp =  append(file,convert("0",1));
    var ip =  append(file,convert(data.ip,15));
    var subnet =  append(file,convert(data.subnet,15));
    var gateway =  append(file,convert(data.gateway,15));
    var dns1 =  append(file,convert(data.dns1,15));
    var dns2 = append(file,convert( data.dns2,15));
    var rfu = append(file,[String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(file,convert("\n",1) );

    saveAs(new Blob(file,{type:"application/octet-stream"}), "sc001_"+data.service_id)


    file = [];
    index = 0;
    msgid = append(file,convert("SC002",5));
    msgv =  append(file,convert("1",1));
    msgrev =  append(file,convert("0",1));
    var service_id =  append(file,convert(data.service_id,10));
    var host1 =  append(file,convert((data.host1),50));
    var host2 =  append(file,convert((data.host2),50));
    var host3 =  append(file,convert((data.host3),50));
    var swd = append(file,convert((data.swd),100));
    rfu = append(file,[String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(file,convert("\n",1) );

    saveAs(new Blob(file,{type:"application/octet-stream"}), "sc002_"+data.service_id)
  }
  catch(e){
    console.log(e);
  }

}


export const createConfigs_3G = function(data,ip_3g){
  var file = [];
  index = 0;
  try{

    var conf = JSON.parse(localStorage.getItem("3g_settings"));
    ip_3g = parseInt(ip_3g);
    if (isNaN(ip_3g) || ip_3g <=1 || ip_3g >= 254){
      Session.set("alert",{message : ("IP address "+conf.ip+ip_3g + " in not valid")});;
      return;
    }

    var msgid = append(file,convert("SC001",5));
    var msgv =  append(file,convert("1",1));
    var msgrev =  append(file,convert("0",1));
    var service_id =  append(file,convert(data.service_id,10));
    var host =  append(file,convert(("ETS"+data.service_id),50));
    var ntp =  append(file,convert(data.ntp,50));
    var no_if =  append(file,[String.fromCharCode(0),String.fromCharCode(1)]);
    var newline =  append(file,convert("\n",1) );
    var ifnm =  append(file,convert("0",1));
    var iftp =  append(file,convert("0",1));
    var ip =  append(file,convert(conf.ip+ip_3g,15));
    var subnet =  append(file,convert(conf.subnet,15));
    var gateway =  append(file,convert(conf.gateway,15));
    var dns1 =  append(file,convert(data.dns1,15));
    var dns2 = append(file,convert( data.dns2,15));
    var rfu = append(file,[String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(file,convert("\n",1) );

    saveAs(new Blob(file,{type:"application/octet-stream"}), "sc001_"+data.service_id+"_3g")


    file = [];
    index = 0;
    msgid = append(file,convert("SC002",5));
    msgv =  append(file,convert("1",1));
    msgrev =  append(file,convert("0",1));
    var service_id =  append(file,convert(data.service_id,10));
    var host1 =  append(file,convert((data.host1),50));
    var host2 =  append(file,convert((data.host2),50));
    var host3 =  append(file,convert((data.host3),50));
    var swd = append(file,convert((data.swd),100));
    rfu = append(file,[String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(file,convert("\n",1) );

    saveAs(new Blob(file,{type:"application/octet-stream"}), "sc002_"+data.service_id+"_3g")
  }
  catch(e){
    console.log(e);
  }

}
