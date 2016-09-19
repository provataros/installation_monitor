import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js"
import { Mongo } from "meteor/mongo"

export const save_history = function(date,text,id){
  if (date && text){
    Meteor.call("insert_history",date,text,id,function(){
      displayNotification("Successfully saved!","success");
    })
  }
}

export const displayNotification = function(message,type,time = 5000){
  Session.set("notification",{message : message,type : type});
  Meteor.setTimeout(function(){
    Session.set("notification",null);
  },time)
}

export const clear_query = function(){
  Tracker.nonreactive(function(){
    Session.set("s_hwid",null);
    Session.set("s_deid",null);
    Session.set("s_said",null);
    Session.set("s_lsam",null);
    Session.set("s_device_type",null);
    Session.set("s_agency",null);
    Session.set("s_sub_agency",null);
    Session.set("s_station_name",null);
    Session.set("s_sw_status",null);
    Session.set("s_hw_status",null);
    Session.set("s_urgent",null);
    Session.set("s_error",null);
    Session.set("s_sw_version",null);

    Session.set("s_from_install_date",null);
    Session.set("s_untl_install_date",null);

    Session.set("s_from_schedule_date",null);
    Session.set("s_untl_schedule_date",null);

    Session.set("s_from_register_date",null);
    Session.set("s_untl_register_date",null);
  })
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
  var sw_version = Session.get("s_sw_version");

  var from_install = Session.get("s_from_install_date")
  var until_install = Session.get("s_untl_install_date")

  var from_schedule = Session.get("s_from_schedule_date")
  var until_schedule = Session.get("s_untl_schedule_date")

  var from_register = Session.get("s_from_register_date")
  var until_register = Session.get("s_untl_register_date")

  var flag = false;
  var query = {};
  try{
    
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
    if (sw_version){
      flag = true;
      query.sw_version = {$regex: new RegExp(sw_version, "i")};
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
  catch(e){
    console.log("Query regex error. All normal");
  }
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
    throw new Error("Invalid field length : " + str)
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
  var lflag = false;
  var error = false;
  $.each(data,function(key,value){
    try{
      lflag = true;
      var f = createConfigs(value,false);
      if (f){
        zips.push(f);
        zip.folder(value.service_id).folder("IN").file("SC001_"+CryptoJS.MD5(f.file1).toString(),f.file1);
        zip.folder(value.service_id).folder("IN").file("SC002_"+CryptoJS.MD5(f.file2).toString(),f.file2); 
      }    
    }
    catch(e){
      error = true;
      console.log("Please check for missing/incorrect fields");
    }
  })
  if (!lflag)displayNotification("No devices selected.","heads-up")
  if (zips.length>0)saveAs(zip.generate({type : "blob"}), "configs.zip")
  if (!error && lflag)displayNotification("Configuration files successfully created.","success")
}

export const createConfigsBatch3G = function(data){
  if (data.length == 0){
    displayNotification("No devices selected","heads-up",2000);
    return;
  }
  var zips = [];
  var zip = new JSZip();
  var start = 20;
  var error = false;
  var lflag = false;
  $.each(data,function(key,value){
    
    try{
      lflag = true;
      var f = createConfigs_3G(value,""+start,false);
      zips.push(f);
      zip.folder(value.service_id).folder("IN").file("SC001_3G"+CryptoJS.MD5(f.file1).toString(),f.file1);
      zip.folder(value.service_id).folder("IN").file("SC002_3G"+CryptoJS.MD5(f.file2).toString(),f.file2);    
    }
    catch(e){
      error = true;
      console.log("Please check for missing/incorrect fields");
    }
    start++;
  })
  
  if (!lflag)displayNotification("No devices selected.","heads-up",2000)
  if (zips.length>0)saveAs(zip.generate({type : "blob"}), "configs3g.zip")
  if (!error && lflag)displayNotification("Configuration files successfully created.","success")
}

export const createConfigs = function(data,save=true){
  
  index = 0;
  try{
    file = "";
    var s1 = data.ip.split(".");
    var s2 = data.gateway.split(".");
    if (s1[0]!=s2[0] || s1[1]!=s2[1] || s1[2]!=s2[2]){
      throw new Error("IP-Gateway mismatch on service ID "+data.service_id)
    }
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
    if (file1.length !=202){
      throw new Error("File size mismatch!")
    }

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
    if (file2.length !=272){
      throw new Error("File size mismatch!")
    }

    var zip = new JSZip().folder(data.service_id).folder("IN");
    zip.file("sc001_"+CryptoJS.MD5(file1).toString(),file1);
    zip.file("sc002_"+CryptoJS.MD5(file2).toString(),file2);
    if (save){
      saveAs(zip.generate({type : "blob"}), data.service_id+".zip")     
      displayNotification("Configuration files successfully created.","success")
    }
    else return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e + " : " +data.service_id);
    displayNotification("Error(s) while creating the configuration files. Please check F12 log.","error")
    throw(e);
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
    if (file1.length !=202){
      throw new Error("File size mismatch!")
    }
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
    if (file2.length !=272){
      throw new Error("File size mismatch!")
    }

    var zip = new JSZip().folder(data.service_id).folder("IN");
    zip.file("sc001_3g_"+CryptoJS.MD5(file1).toString(),file1);
    zip.file("sc002_3g_"+CryptoJS.MD5(file2).toString(),file2);
    if (save){
      saveAs(zip.generate({type : "blob"}), data.service_id+".zip")
      displayNotification("Configuration files successfully created.","success")
    }
    else return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e  + " : " + data.service_id);
    displayNotification("Error(s) while creating the configuration files. Please check F12 log.","error")
    throw(e)
  }

}

export const createConfigsReference = function(save=true){
  index = 0;
  try{
    
    file = "";
    var msgid =append(convert("SC001",5));
    var msgv = append(convert("1",1));
    var msgrev = append(convert("0",1));
    var service_id = append(convert("1000000001",10));
    var host = append(convert(("ETS"+"1000000001"),50));
    var ntp = append(convert("10.230.225.1",50));
    var no_if = append([String.fromCharCode(0),String.fromCharCode(1)]);
    var newline = append(convert("\n",1) );
    var ifnm = append(convert("0",1));
    var iftp = append(convert("0",1));
    var ip = append(convert("10.230.40.2",15));
    var subnet = append(convert("255.255.255.0",15));
    var gateway = append(convert("10.230.40.1",15));
    var dns1 = append(convert("8.8.8.8",15));
    var dns2 =append(convert("8.8.4.4",15));
    var rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    var file1 = file.slice(0);
    file = "";

    index = 0;
    msgid =append(convert("SC002",5));
    msgv = append(convert("1",1));
    msgrev = append(convert("0",1));
    var service_id = append(convert("1000000001",10));
    var host1 = append(convert("10.230.2.31:10005",50));
    var host2 = append(convert("10.232.66.41:10005",50));
    var host3 = append(convert("10.232.2.7:10021",50));
    var swd =append(convert("http://10.230.2.31/services/swd",100));
    rfu =append([String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0),String.fromCharCode(0)]);
    append(convert("\n",1) );

    
    var file2 = file.slice(0);

    var zip = new JSZip().folder("1000000001").folder("IN");
    zip.file("sc001_"+CryptoJS.MD5(file1).toString(),file1);
    zip.file("sc002_"+CryptoJS.MD5(file2).toString(),file2);
    if (save)saveAs(zip.generate({type : "blob"}), "1000000001"+".zip")
    else return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e);
  }

}

export const testConfigGeneration = function(){
  var test = createConfigsReference(false);
  var md51 = "985c95ca6451fb8a470509abd5fadbc3"
  var md52 = "b423cdd985bbbe9b6e4c76a67b2873f1"
  var f1 = CryptoJS.MD5(test.file1).toString();
  var f2 = CryptoJS.MD5(test.file2).toString();
  if (md51===f1 && md52===f2)console.log("Checksums match. Config generation is safe!")
  else displayNotification("Warning: Config file checksum mismatch. Generation is not safe!","error",2000);
}