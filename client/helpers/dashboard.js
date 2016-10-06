import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js";
import {readXLSX} from "/client/lib/excel.js"
import {getStationInfo} from "./named.js"

Template.dashboardPanel.helpers({
    nextStationId : function(){
        if (!Mongo._subs.stations.ready())return;
        return Session.get("dashboard_station").id;
    },
    station_name : function(){
        if (!Mongo._subs.stations.ready())return;
        return Session.get("dashboard_station").eng;
    },
    getAgency : function(){
        if (!Mongo._subs.stations.ready())return;
        return Session.get("dashboard_agency");
    },
    getSubagency : function(){
        if (!Mongo._subs.stations.ready())return;
        return Session.get("dashboard_subagency");
    },
    dashboardStatus : dashboardStatus,
    dashboardDevice : dashboardDevice,
    readxlsx : function(){
        return Session.get("xlsx")
    },
    displayInfo : function(){
        var next = Session.get("dashboard_station");
        if (GoogleMaps.loaded() && (GoogleMaps.maps.map)) {
            var pos = new google.maps.LatLng(next.lat, next.lng);
            var map = GoogleMaps.maps.map.instance;
            map.panTo(pos)
            marker.setMap(null);
            marker = new google.maps.Marker({
                position: pos,
                map: map,
                optimized: false,
                zIndex : 9999999999
            });

            return;
            var data = {
                field : "station_id",
                type : Session.get("dashboard_station").id,
                name : Session.get("dashboard_station").eng
            }
            var data = dashboardDevice("station_name",next.station_name);
            data.name = next.eng;
            infowindow.setContent(Blaze.toHTMLWithData(Template.dashboardAgency,data));   
            infowindow.setPosition(pos);
            
            infowindow.open(map);
        }
    }
    
});

function compare(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

Template.dashboardAgency.helpers({
    severity : function(val){
        return val==0?"0,80,0":""+Math.floor(100+val*155/100)+",0,0";
    },
    positive : function(val){
        return val==100?"0,150,0":""+Math.floor(100+val*155/100)+",0,0";
    }
})

function dashboardDevice(agency,type){
    var devices = Mongo._devices.find({[agency] : type}).fetch();
    var tmp = {};
    var types = [];
    _.each(devices,function(value,key){
        if (!tmp[value.device_type]){
            tmp[value.device_type] = true;
            types.push({name : value.device_type});
        }
    })
    types.sort(compare);
    _.each(types,function(value,key){
        //console.log(key,value);
        types[key].total = Mongo._devices.find({[agency] : type, device_type : value.name}).count();
        types[key].hw_done = Mongo._devices.find({[agency] : type, device_type : value.name,hw_status : "Done"}).count();
        types[key].sw_done = Mongo._devices.find({[agency] : type, device_type : value.name,sw_status : "Done"}).count();
        types[key].hw_errors = Mongo._devices.find({[agency] : type, device_type : value.name,hw_error : "true"}).count();
        types[key].sw_errors = Mongo._devices.find({[agency] : type, device_type : value.name,sw_error : "true"}).count();
        types[key].hw_done_per = Math.floor(Math.round((100*types[key].hw_done/types[key].total)));
        types[key].sw_done_per = Math.floor(Math.round((100*types[key].sw_done/types[key].total)));
        types[key].hw_errors_per = Math.floor(Math.round((100*types[key].hw_errors/types[key].total)));
        types[key].sw_errors_per = Math.floor(Math.round((100*types[key].sw_errors/types[key].total)));
    })
    return {agency : type,data : types};
}

function dashboardStatus(field,type,name){
        if (!Mongo._subs.devices.ready())return;
        var now = Date.now();
        var f = {
            total : Mongo._devices.find({[field] : type}).count(),
            title : name,
            hw_error : Mongo._devices.find({[field] : type,hw_error : "true"}).count(),
            sw_error : Mongo._devices.find({[field] : type,sw_error : "true"}).count(),
            completed : Mongo._devices.find({[field] : type,"hw_status" : "Done","sw_status" : "Done",hw_error  :{$not : "true"},sw_error : {$not : "true"}}).count(),
            completed_witherror : Mongo._devices.find({[field] : type,"hw_status" : "Done","sw_status" : "Done",$or : [{sw_error : "true"},{hw_error : "true"}]}).count(),
            completed_withSWerror : Mongo._devices.find({[field] : type,"hw_status" : "Done","sw_status" : "Done",sw_error : "true"}).count(),
            completed_withHWerror : Mongo._devices.find({[field] : type,"hw_status" : "Done","sw_status" : "Done",hw_error : "true"}).count(),
            sw_status : _.countBy(Mongo._devices.find({[field] : type},{fields:{sw_status : 1}}).fetch(),function(customer){return customer.sw_status}),
            hw_status : _.countBy(Mongo._devices.find({[field] : type},{fields:{hw_status : 1}}).fetch(),function(customer){return customer.hw_status}),
        }
        f.total_error = f.hw_error + f.sw_error;
        f.sw_notset = f.sw_status[""]?f.sw_status[""]:0 + f.sw_status["undefined"]?f.sw_status["undefined"]:0;
        f.hw_notset = f.hw_status[""]?f.hw_status[""]:0 + f.hw_status["undefined"]?f.hw_status["undefined"]:0;
        f.sw_notset_percent = Math.floor(Math.round((f.sw_notset/f.total)*100)) || 0;
        f.hw_notset_percent = Math.floor(Math.round((f.hw_notset/f.total)*100)) || 0;
        f.total_error = f.hw_error + f.sw_error;
        f.type = type;
        f.totalpercent = Math.floor((f.completed/f.total)*100);
        f.total_hw_error_percent = Math.floor(Math.round((f.hw_error/f.total_error)*100)) || 0;
        f.total_sw_error_percent = Math.floor(Math.round((f.sw_error/f.total_error)*100)) || 0;
        _.each(f.sw_status,function(value,key){
            f.sw_status[key] = {val : value,percent : Math.floor(Math.round((value/f.total)*100)) || 0};
        })
        _.each(f.hw_status,function(value,key){
            f.hw_status[key] = {val : value,percent : Math.floor(Math.round((value/f.total)*100)) || 0};
        })

        //console.log(Date.now()-now + " ms")

        return f;
    };

Template.dashboardGeneral.helpers({
    makeArray : function(obj){
        var f = [];
        _.each(obj,function(key,value){
            f.push({key : value, value : key})
        })
        return f;
    },
    isFieldSet : function(data){
        if (data == "" || data == "undefined"){
            return false;
        }
        return true;
    }
});
var marker;
var infowindow;
function nextStation(){
    if (!Mongo._subs.stations.ready())return;
    var curr = Session.get("dashboard_station");
    if (startup || !curr || !curr.id){
        startup = false;
        curr = Mongo._stations.findOne({id: {$gt: "0"},$or : 
            [
                {sub_agency : "Metro",line : "1"},
                {sub_agency : "Tram"},
            ]
            
        });
    }

    var next = {};
    while(!next.id){
        next = Mongo._stations.findOne({id: {$gt: curr.id},$or : 
        [
            {sub_agency : "Metro",line : "1"},
            {sub_agency : "Tram"},
        ]})
        if (!next)next = Mongo._stations.findOne({id: {$gt: "0"},$or : 
        [
            {sub_agency : "Metro",line : "1"},
            {sub_agency : "Tram"},
        ]});
    }
    Session.set("dashboard_agency",next.agency);
    Session.set("dashboard_subagency",next.sub_agency);
    Session.set("dashboard_station",next);
    
}
var interval;
var startup = false;
Template.dashboardPanel.onRendered(function(){
    startup = true;
    interval = Meteor.setInterval(function(){
        nextStation();
        console.log("tick");
    },5000);
})
Template.dashboardPanel.onDestroyed(function(){
    Meteor.clearInterval(interval);
    startup=false;
    Session.set("dashboard_agency",null);
    Session.set("dashboard_subagency",null);
})
//S.E.F. - Stadio Irinis Kai Filias



Template.dashboard.helpers({
    mapOptions : function(){
    if (GoogleMaps.loaded()) {
      // Map initialization options
      
    marker = new google.maps.Marker({
        position : new google.maps.LatLng(0,0)
    });
    infowindow = new google.maps.InfoWindow({
    });
      return {
        center: new google.maps.LatLng(37.961794, 23.720856),
        zoom: 13,
        minZoom: 11,
        maxZoom: 19 ,
        showLines : true,
        showCircles : true,
        mapTypeControl: false,
        hoverEnabled : true,
        draggableCursor:'default',
        styles: [
          {
              "featureType": "poi",
              "stylers": [
                  { "visibility": "off" }
              ]
          },
          {
              "featureType": "transit.line",
              "stylers": [
                  { "visibility": "off" }
              ]
          },
          {
              "featureType": "transit.station",
              "stylers": [
                  { "visibility": "off" }
              ]
          },
          {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                  { "visibility": "off" }
              ]
          }
      ],
    };
    }
  },
})




Template.progressTable.helpers({
    toDate : function(item){
        return moment(item).format("DD/MM");
    }
})

function xl2jsdt(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


function getRow(ws,r,c,l,func){
    var f = [];
    for (var i=0;i<l;i++){
        var cc = ws[XLSX.utils.encode_cell({r:r,c:(c+i)})];
        if (func)f.push(func(cc.v))
        else f.push(cc.v);
    }
    return f;
}
function getRowEdit(ws,row,start,length){
    var f = getRow(ws,row,start,length+2);
    return {name : f[0],total : f[1],data : f.slice(2)}
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    var i,f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
        var data = e.target.result;
    
        /* if binary string, read with type 'binary' */
        var wb = XLSX.read(data, {type: 'binary'});
        Meteor.wb = wb;
        wb.Sheets["09-16"];
        Meteor.ws=wb.Sheets["09-16"];
        var ws = wb.Sheets["09-16"];

        var length = 0;
        var f;
        while ((f= ws[XLSX.utils.encode_cell({r:3,c:(6+length)})]) != undefined){
            length++;
        }

        var master = {data : []};
        master.headers = getRow(ws,3,6,length,xl2jsdt);

        var depot_row = 9;
        var cell;
        master.sum = {
            cabling_start : getRowEdit(ws,4,4,length),
            cabling_end : getRowEdit(ws,4+1,4,length),
            equipment_installation_start : getRowEdit(ws,4+2,4,length),
            equipment_installation_end : getRowEdit(ws,4+3,4,length),
            ic_confirm : getRowEdit(ws,4+4,4,length),

        }
        while (  (cell = ws["C"+(depot_row+1)]) != undefined) {
            master.data.push(
                {
                    operator : cell.v,
                    installer : ws["D"+(depot_row+1)],
                    cabling_start : getRowEdit(ws,depot_row,4,length),
                    cabling_end : getRowEdit(ws,depot_row+1,4,length),
                    equipment_installation_start : getRowEdit(ws,depot_row+2,4,length),
                    equipment_installation_end : getRowEdit(ws,depot_row+3,4,length),
                    ic_confirm : getRowEdit(ws,depot_row+4,4,length),

                }
            )


          depot_row += 5;
      }
      Session.set("xlsx",master);
    };
    reader.readAsBinaryString(f);
  }
}



Meteor.startup(function(){
   
})