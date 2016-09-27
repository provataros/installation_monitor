import { Mongo } from "meteor/mongo"


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
  var zips = {};
  var zip = new JSZip();
  var lflag = false;
  var error = false;
  var f;
  _.each(data,function(value,key){
    try{
      lflag = true;
      f = createConfigs(value,false);
      if (f){
        zips[value.service_id] = {ok : true,data : f};
        zip.folder(value.service_id).folder("IN").file("SC001_"+CryptoJS.MD5(f.file1).toString(),f.file1);
        zip.folder(value.service_id).folder("IN").file("SC002_"+CryptoJS.MD5(f.file2).toString(),f.file2); 
      }
      else{
        zips[value.service_id] = {ok : false};
      }
    }
    catch(e){
      error = true;
      zips[value.service_id] = {ok : false};
      console.log("Please check for missing/incorrect fields");
    }
  })
  if (!lflag)console.log("No devices selected.","heads-up")
  return zips;
}

export const createConfigsBatch3G = function(data,subnet){
  if (data.length == 0){
    console.log("No devices selected","heads-up",2000);
    return;
  }
  var zips = {};
  var zip = new JSZip();
  var start = 20;
  var error = false;
  var lflag = false;
  _.each(data,function(value){
    try{
      lflag = true;
      var f = createConfigs_3G(value,""+start,false,subnet);
      if (f){
        zips[value.service_id] = {ok : true,data : f};
        zip.folder(value.service_id).folder("IN").file("SC001_3G"+CryptoJS.MD5(f.file1).toString(),f.file1);
        zip.folder(value.service_id).folder("IN").file("SC002_3G"+CryptoJS.MD5(f.file2).toString(),f.file2);    
      }
      else{
        zips[value.service_id] = {ok : false};
      }
    }
    catch(e){
      error = true;
      console.log("Please check for missing/incorrect fields");
      zips[value.service_id] = {ok : false};
    }
    start++;
  })
  
  if (!lflag)console.log("No devices selected.","heads-up",2000)
  return zips;
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
    return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e + " : " +data.service_id);
    console.log("Error(s) while creating the configuration files. Please check F12 log.","error")
    throw(e);
  }

}


export const createConfigs_3G = function(data,ip_3g,save=true,extrasubnet){
  index = 0;
  try{

    var conf = !extrasubnet?JSON.parse(localStorage.getItem("config")):extrasubnet;
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
    return {file1 : file1,file2 : file2};
  }
  catch(e){
    console.log(e  + " : " + data.service_id);
    console.log("Error(s) while creating the configuration files. Please check F12 log.","error")
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
    return {file1 : file1,file2 : file2};
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
  else console.log("Warning: Config file checksum mismatch. Generation is not safe!","error",2000);
}