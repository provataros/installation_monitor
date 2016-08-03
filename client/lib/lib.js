import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js"
import { Mongo } from "meteor/mongo"

export const save_history = function(date,text,id){
  if (date && text){
    Meteor.call("insert_history",date,text,id,function(){
      console.log("done");
    })
  }
}

export const construct_query = function(){
  var hardware = Session.get("s_hwid");
  var device = Session.get("s_deid");
  var account =  Session.get("s_said");
  var lsam = Session.get("s_lsam");
  var type = Session.get("s_device_type");
  var agency = Session.get("s_agency");
  var sub_agency = Session.get("s_sub_agency");
  var station_name = Session.get("s_station_name");
  var sw_status = Session.get("s_sw_status");
  var hw_status = Session.get("s_hw_status");
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
    query.hw_id = {$regex: new RegExp(hardware, "i")};
  }
  if (device){
    flag = true;
    query.device_id = {$regex: new RegExp(device, "i")};
  }
  if (account){
    flag = true;
    query.service_id = {$regex: new RegExp(account, "i")};
  }
  if (lsam){
    flag = true;
    query.lsam_id = {$regex: new RegExp(lsam, "i")};
  }
  if (type){
    flag = true;
    query.device_type = type
  }
  if (agency){
    flag = true;
    query.agency = agency
  }
  if (sub_agency){
    flag = true;
    query.sub_agency = sub_agency
  }
  if (station_name){
    flag = true;
    query.station_name = {$regex: new RegExp(station_name, "i")};
  }
  if (sw_status){
    flag = true;
    query.sw_status = sw_status
  }
  if (hw_status){
    flag = true;
    query.hw_status = hw_status;
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

var file = "";
function append(data){
  for (var i=0;i<data.length;i++){
    file += data[i];
  }
}

export const createConfigsBatch = function(data){
  var zips = [];
  var zip = new JSZip();
  $.each(data,function(key,value){
    try{
      var f = createConfigs(value,false);
      zips.push(f);
      zip.folder(value.service_id).folder("IN").file("SC001_"+value.service_id,f.file1);
      zip.folder(value.service_id).folder("IN").file("SC002_"+value.service_id,f.file2);     
    }
    catch(e){
      console.log(e);
      console.log("Please check for missing/incorrect fields");
    }
  })
  if (zips.length>0)saveAs(zip.generate({type : "blob"}), "configs.zip")
}

export const createConfigsBatch3G = function(data){
  var zips = [];
  var zip = new JSZip();
  var start = 20;
  $.each(data,function(key,value){
    try{
      var f = createConfigs_3G(value,""+start,false);
      zips.push(f);
      zip.folder(value.service_id).folder("IN").file("SC001_3G_"+value.service_id,f.file1);
      zip.folder(value.service_id).folder("IN").file("SC002_3G_"+value.service_id,f.file2);     
    }
    catch(e){
      console.log(e);
      console.log("Please check for missing/incorrect fields");
    }
    start++;
  })
  if (zips.length>0)saveAs(zip.generate({type : "blob"}), "configs3g.zip")
}

export const createConfigs = function(data,save=true){
  
  index = 0;
  try{
    file = "";
    var msgid =append(convert("SC001",5));
    var msgv = append(convert("1",1));
    var msgrev = append(convert("0",1));
    var service_id = append(convert(data.service_id,10));
    var host = append(convert(("ETS"+data.service_id),50));
    var ntp = append(convert(data.ntp,50));
    var no_if = append([String.fromCharCode(0),String.fromCharCode(1)]);
    var newline = append(convert("\n",1) );
    var ifnm = append(convert("0",1));
    var iftp = append(convert("0",1));
    var ip = append(convert(data.ip,15));
    var subnet = append(convert(data.subnet,15));
    var gateway = append(convert(data.gateway,15));
    var dns1 = append(convert(data.dns1,15));
    var dns2 =append(convert( data.dns2,15));
    var rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    var file1 = file.slice(0);

    file = "";
    index = 0;
    msgid =append(convert("SC002",5));
    msgv = append(convert("1",1));
    msgrev = append(convert("0",1));
    var service_id = append(convert(data.service_id,10));
    var host1 = append(convert((data.host1),50));
    var host2 = append(convert((data.host2),50));
    var host3 = append(convert((data.host3),50));
    var swd =append(convert((data.swd),100));
    rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    var file2 = file.slice(0);

    var zip = new JSZip().folder(data.service_id).folder("IN");
    zip.file("sc001_"+data.service_id,file1);
    zip.file("sc002_"+data.service_id,file2);
    if (save)saveAs(zip.generate({type : "blob"}), data.service_id+".zip")
    else return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e);
    Session.set("alert",{message : ("Please check for missing/incorrect fields")});;
  }

}


export const createConfigs_3G = function(data,ip_3g,save=true){
  index = 0;
  try{

    var conf = JSON.parse(localStorage.getItem("config"));
    ip_3g = parseInt(ip_3g);
    if (isNaN(ip_3g) || ip_3g <=1 || ip_3g >= 254){
      Session.set("alert",{message : ("IP address "+conf.ip+ip_3g + " in not valid")});;
      return;
    }
    
    file = "";
    var msgid =append(convert("SC001",5));
    var msgv = append(convert("1",1));
    var msgrev = append(convert("0",1));
    var service_id = append(convert(data.service_id,10));
    var host = append(convert(("ETS"+data.service_id),50));
    var ntp = append(convert(data.ntp,50));
    var no_if = append([String.fromCharCode(0),String.fromCharCode(1)]);
    var newline = append(convert("\n",1) );
    var ifnm = append(convert("0",1));
    var iftp = append(convert("0",1));
    var ip = append(convert(conf["3g_subnet"]+"."+ip_3g,15));
    var subnet = append(convert(data.subnet,15));
    var gateway = append(convert(conf["3g_subnet"]+".1",15));
    var dns1 = append(convert(data.dns1,15));
    var dns2 =append(convert( data.dns2,15));
    var rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    var file1 = file.slice(0);
    file = "";

    index = 0;
    msgid =append(convert("SC002",5));
    msgv = append(convert("1",1));
    msgrev = append(convert("0",1));
    var service_id = append(convert(data.service_id,10));
    var host1 = append(convert((data.host1),50));
    var host2 = append(convert((data.host2),50));
    var host3 = append(convert((data.host3),50));
    var swd =append(convert((data.swd),100));
    rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    
    var file2 = file.slice(0);

    var zip = new JSZip().folder(data.service_id).folder("IN");
    zip.file("sc001_"+data.service_id,file1);
    zip.file("sc002_"+data.service_id,file2);
    if (save)saveAs(zip.generate({type : "blob"}), data.service_id+".zip")
    else return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e);
  }

}
