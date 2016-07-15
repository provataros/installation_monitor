import { Mongo } from 'meteor/mongo';


var devices = new Mongo.Collection("devices");
var stations = new Mongo.Collection("stations");

Meteor.publish("devices",function(){
  return devices.find({});
})
Meteor.publish("stations",function(){
  return stations.find({});
})
Meteor.startup(function(){
  if (false)console.log(_.each(stations_obj,function(doc){
    stations.insert(doc);
  }));
})

Meteor.methods({
  test : function(fields){
    console.log(_.each([{
      hw_id : "6100002",//
      device_id : "450000300",//
      agent_id : "0000001",//
      service_id : "1000000001",//
      feeset_id : "0000000004",//
      lsam_id : "1510020020010422",//
      hw_comments : "",
      sw_comments : "",
      agency_comments : "",

      hw_status : "",//
      sw_status : "",//

      label : "",//
      agency : "STASY",//
      sub_agency : "Tram",//
      device_type : "ACIM",//
      firmware_type : "",//
      supervisor : "Kyung Hoon, Ryu",//
      hp_number : "0",
      station_id : "",
      station_name : "",
      line : "",
      location : "Athens Office",
      ip : "192.168.1.8",
      subnet : "255.255.255.0",
      gateway : "192.168.1.1",
      ntp : "10.230.1.225",
      dns1 : "8.8.8.8",
      dns2 : "8.8.4.4",
      host1 : "10.230.66.41:10005",
      host2 : "10.232.10.31:10005",
      host3 : "10.232.2.7:10021",
      swd : "http://10.230.2.31/services/swd",
      operator_name : "",
      operator_id : "",
      operator_card : "",

    },
    {
      hw_id : "6100645",
      device_id : "450000300",
      agent_id : "0000001",
      service_id : "1000000001",
      feeset_id : "0000000004",
      lsam_id : "1510020020010422",


      hw_status : "",
      sw_status : "",

      label : "",
      agency : "STASY",
      sub_agency : "Tram",
      device_type : "ACIM",
      firmware_type : "",
      supervisor : "Kyung Hoon, Ryu",
      hp_number : "0",
      station_id : "",
      station_name : "",
      line : "",
      location : "Athens Office",
      ip : "192.168.1.8",
      subnet : "255.255.255.0",
      gateway : "192.168.1.1",
      ntp : "10.230.1.225",
      dns1 : "8.8.8.8",
      dns2 : "8.8.4.4",
      host1 : "10.230.66.41:10005",
      host2 : "10.232.10.31:10005",
      host3 : "10.232.2.7:10021",
      swd : "http://10.230.2.31/services/swd",
      operator_name : "",
      operator_id : "",
      operator_card : "",

    },
    {
      hw_id : "6584112",
      device_id : "450000300",
      agent_id : "0000001",
      service_id : "1000000001",
      feeset_id : "0000000004",
      lsam_id : "1510020020010422",


      hw_status : "",
      sw_status : "",

      label : "",
      agency : "STASY",
      sub_agency : "Tram",
      device_type : "ACIM",
      firmware_type : "",
      supervisor : "Kyung Hoon, Ryu",
      hp_number : "0",
      station_id : "",
      station_name : "",
      line : "",
      location : "Athens Office",
      ip : "192.168.1.8",
      subnet : "255.255.255.0",
      gateway : "192.168.1.1",
      ntp : "10.230.1.225",
      dns1 : "8.8.8.8",
      dns2 : "8.8.4.4",
      host1 : "10.230.66.41:10005",
      host2 : "10.232.10.31:10005",
      host3 : "10.232.2.7:10021",
      swd : "http://10.230.2.31/services/swd",
      operator_name : "",
      operator_id : "",
      operator_card : "",

    },
    {
      hw_id : "5997566",
      device_id : "450000300",
      agent_id : "0000001",
      service_id : "1000000001",
      feeset_id : "0000000004",
      lsam_id : "1510020020010422",


      hw_status : "",
      sw_status : "",

      label : "",
      agency : "STASY",
      sub_agency : "Tram",
      device_type : "ACIM",
      firmware_type : "",
      supervisor : "Kyung Hoon, Ryu",
      hp_number : "0",
      station_id : "",
      station_name : "",
      line : "",
      location : "Athens Office",
      ip : "192.168.1.8",
      subnet : "255.255.255.0",
      gateway : "192.168.1.1",
      ntp : "10.230.1.225",
      dns1 : "8.8.8.8",
      dns2 : "8.8.4.4",
      host1 : "10.230.66.41:10005",
      host2 : "10.232.10.31:10005",
      host3 : "10.232.2.7:10021",
      swd : "http://10.230.2.31/services/swd",
      operator_name : "",
      operator_id : "",
      operator_card : "",

    },
    {
      hw_id : "698526",
      device_id : "450000300",
      agent_id : "0000001",
      service_id : "1000000001",
      feeset_id : "0000000004",
      lsam_id : "1510020020010422",


      hw_status : "",
      sw_status : "",

      label : "",
      agency : "STASY",
      sub_agency : "Tram",
      device_type : "ACIM",
      firmware_type : "",
      supervisor : "Kyung Hoon, Ryu",
      hp_number : "0",
      station_id : "",
      station_name : "",
      line : "",
      location : "Athens Office",
      ip : "192.168.1.8",
      subnet : "255.255.255.0",
      gateway : "192.168.1.1",
      ntp : "10.230.1.225",
      dns1 : "8.8.8.8",
      dns2 : "8.8.4.4",
      host1 : "10.230.66.41:10005",
      host2 : "10.232.10.31:10005",
      host3 : "10.232.2.7:10021",
      swd : "http://10.230.2.31/services/swd",
      operator_name : "",
      operator_id : "",
      operator_card : "",

    }],function(doc){
      devices.insert(doc);
    }));
  },
  find : function(){
    console.log(devices.find({}).fetch());
  },
  save : function(id,data){
    return devices.update( {_id : id },{$set : data});
  }
})




var stations_obj = [
  { id : "01011", name : "Piraeus", eng : "Piraeus"	, sub_agency : "Metro"},
  { id : "01012", name : "Faliro", eng : "Faliro"	, sub_agency : "Metro"},
  { id : "01013", name : "Moschato", eng : "Moschato"	, sub_agency : "Metro"},
  { id : "01014", name : "Kallithea", eng : "Kallithea"	, sub_agency : "Metro"},
  { id : "01015", name : "Tavros", eng : "Tavros"	, sub_agency : "Metro"},
  { id : "01016", name : "Petralona", eng : "Petralona"	, sub_agency : "Metro"},
  { id : "01017", name : "Thiseio", eng : "Thiseio"	, sub_agency : "Metro"},
  { id : "01018", name : "Monastiraki", eng : "Monastiraki"	, sub_agency : "Metro"},
  { id : "01019", name : "Omonia", eng : "Omonia"	, sub_agency : "Metro"},
  { id : "01020", name : "Victoria", eng : "Victoria"	, sub_agency : "Metro"},
  { id : "01021", name : "Attiki", eng : "Attiki"	, sub_agency : "Metro"},
  { id : "01022", name : "Agios Nikolaos", eng : "Agios Nikolaos"	, sub_agency : "Metro"},
  { id : "01023", name : "Kato Patisia", eng : "Kato Patisia"	, sub_agency : "Metro"},
  { id : "01024", name : "Agios Eleftherios", eng : "Agios Eleftherios"	, sub_agency : "Metro"},
  { id : "01025", name : "Ano Patisia", eng : "Ano Patisia"	, sub_agency : "Metro"},
  { id : "01026", name : "Perissos", eng : "Perissos"	, sub_agency : "Metro"},
  { id : "01027", name : "Pefkakia", eng : "Pefkakia"	, sub_agency : "Metro"},
  { id : "01028", name : "Nea Ionia", eng : "Nea Ionia"	, sub_agency : "Metro"},
  { id : "01029", name : "Irakleio", eng : "Irakleio"	, sub_agency : "Metro"},
  { id : "01030", name : "Eirini", eng : "Eirini"	, sub_agency : "Metro"},
  { id : "01031", name : "Marousi", eng : "Marousi"	, sub_agency : "Metro"},
  { id : "01032", name : "KAT", eng : "KAT"	, sub_agency : "Metro"},
  { id : "01033", name : "Kifisia", eng : "Kifisia"	, sub_agency : "Metro"},
  { id : "01034", name : "Anthoupoli", eng : "Anthoupoli"	, sub_agency : "Metro"},
  { id : "01035", name : "Peristeri", eng : "Peristeri"	, sub_agency : "Metro"},
  { id : "01036", name : "Agios Antonios", eng : "Agios Antonios"	, sub_agency : "Metro"},
  { id : "01037", name : "Sepolla", eng : "Sepolla"	, sub_agency : "Metro"},
  { id : "01038", name : "Attiki", eng : "Attiki"	, sub_agency : "Metro"},
  { id : "01039", name : "Larissa Station", eng : "Larissa Station"	, sub_agency : "Metro"},
  { id : "01040", name : "Metaxourghio", eng : "Metaxourghio"	, sub_agency : "Metro"},
  { id : "01041", name : "Panepistimio", eng : "Panepistimio"	, sub_agency : "Metro"},
  { id : "01042", name : "Syntagma", eng : "Syntagma"	, sub_agency : "Metro"},
  { id : "01043", name : "Akropoli", eng : "Akropoli"	, sub_agency : "Metro"},
  { id : "01044", name : "Syngrou Fix", eng : "Syngrou Fix"	, sub_agency : "Metro"},
  { id : "01045", name : "Neos Kosmos", eng : "Neos Kosmos"	, sub_agency : "Metro"},
  { id : "01046", name : "Agios Loannis", eng : "Agios Loannis"	, sub_agency : "Metro"},
  { id : "01047", name : "Dafni", eng : "Dafni"	, sub_agency : "Metro"},
  { id : "01048", name : "Agios Dimitrios", eng : "Agios Dimitrios"	, sub_agency : "Metro"},
  { id : "01049", name : "llioupoli", eng : "llioupoli"	, sub_agency : "Metro"},
  { id : "01050", name : "Alimos", eng : "Alimos"	, sub_agency : "Metro"},
  { id : "01051", name : "Argyroupoli", eng : "Argyroupoli"	, sub_agency : "Metro"},
  { id : "01052", name : "Elliniko", eng : "Elliniko"	, sub_agency : "Metro"},
  { id : "01053", name : "Agia Marina", eng : "Agia Marina"	, sub_agency : "Metro"},
  { id : "01054", name : "Egaleo", eng : "Egaleo"	, sub_agency : "Metro"},
  { id : "01055", name : "Eleonas", eng : "Eleonas"	, sub_agency : "Metro"},
  { id : "01056", name : "Kerameikos", eng : "Kerameikos"	, sub_agency : "Metro"},
  { id : "01057", name : "Monastiraki", eng : "Monastiraki"	, sub_agency : "Metro"},
  { id : "01058", name : "Syntagma", eng : "Syntagma"	, sub_agency : "Metro"},
  { id : "01059", name : "Evangelismos", eng : "Evangelismos"	, sub_agency : "Metro"},
  { id : "01060", name : "Megaro Moussikis", eng : "Megaro Moussikis"	, sub_agency : "Metro"},
  { id : "01061", name : "Ambeiokipi", eng : "Ambeiokipi"	, sub_agency : "Metro"},
  { id : "01062", name : "Panormou", eng : "Panormou"	, sub_agency : "Metro"},
  { id : "01063", name : "Katehaki", eng : "Katehaki"	, sub_agency : "Metro"},
  { id : "01064", name : "Ethniki Amyna", eng : "Ethniki Amyna"	, sub_agency : "Metro"},
  { id : "01065", name : "Holargos", eng : "Holargos"	, sub_agency : "Metro"},
  { id : "01066", name : "Nomismatokipio", eng : "Nomismatokipio"	, sub_agency : "Metro"},
  { id : "01067", name : "Agia Paraskevi", eng : "Agia Paraskevi"	, sub_agency : "Metro"},
  { id : "01068", name : "Chalandri", eng : "Chalandri"	, sub_agency : "Metro"},
  { id : "01069", name : "Doukissis Plakentias", eng : "Doukissis Plakentias"	, sub_agency : "Metro"},
  { id : "01070", name : "Pallini", eng : "Pallini"	, sub_agency : "Metro"},
  { id : "01071", name : "Paiania-Kantza", eng : "Paiania-Kantza"	, sub_agency : "Metro"},
  { id : "01072", name : "Athens International Airport", eng : "Athens International Airport"	, sub_agency : "Metro"},

];
