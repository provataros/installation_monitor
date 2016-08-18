import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"


import {construct_query} from "/client/lib/lib.js"
import {clear_query} from "/client/lib/lib.js"

function getStationInfo(name){
  var f = Mongo._devices.find({station_name : name}).fetch();
    var types = {};
    var type;
    for (var i=0;i<f.length;i++){
      type = f[i].device_type;
      !types[type]?(types[type] = {name : type , data : [],hw : 0,sw : 0}):null;
      types[type].data.push(f[i])
      if (f[i].hw_status == "Done"){
        types[type].hw++;
      }
      if (f[i].sw_status == "Done"){
        types[type].sw++;
      }
    }
    var result = [];
    _.each(types,function(key,value){
      key.dcount = key.data.length;
      if (key.hw==0)key.hw = "<label class = 'error'>"+key.hw+"</label>"
      else if (key.hw==key.dcount)key.hw = "<label class = 'success'>"+key.hw+"</label>"
      else key.hw = "<label class = 'warning'>"+key.hw+"</label>"
      if (key.sw==0)key.sw = "<label class = 'error'>"+key.sw+"</label>"
      else if (key.sw==key.dcount)key.sw = "<label class = 'success'>"+key.sw+"</label>"
      else key.sw = "<label class = 'warning'>"+key.sw+"</label>"
      result.push(key);
    })
    //console.log(result)
    return result
  }

Template.search_results.helpers({
  
  isUrgent : function(){
    return this.urgent=="true"?"urgent":"";
  },
  save : function(){
    Session.set("search_results",this.fetch());
  }
})

Template.dropdown.helpers({
  isSamTracking : function(){
    if (this.name == "sam_tracking")return true;
    return false;
  }
})

Template.date.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(this.find(".device-input")).val() ,
    format : "dddd DD MMM YYYY"
  },function(date){
    $(that.find(".device-input")).val(date);
  });
})

Template.popup.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(this.find(".device-input")).val() ,
    format : "dddd DD MMM YYYY",
    position : "fixed"
  },function(date){
    $(that.find(".date-input")).val(date);
  });
  this.$('.datepicker').val(moment().format("dddd DD MMM YYYY"))
  this.$('.date-input').val(moment().format("YYYYMMDDHHmmss"))
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

Template.install_image.helpers({
  getImages : function(){
    //console.log(this);
    Meteor.call("getImages",this.image,function(error,result){
      $("#previous-images").empty();
      if (!result)return;
      result.reverse();
      for (var i=0;i<result.length;i++){
        if (!result[i].error){
          var image = new Image();
          image.src = 'data:image/png;base64,'+result[i].image;
          $("#previous-images").append(image);
        }
      }
    })
  }
})

Template.map.helpers({
  mapOptions : function(){
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(37.961794, 23.720856),
        zoom: 12,
        minZoom: 11,
        maxZoom: 19 ,
        mapTypeControl: false,
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
                  { "visibility": "on" }
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
  addRoutes : function(){
    GoogleMaps.ready("map",function(){
      var stations_line3 = [
          {
              name : "Agia Marina",
              lat : 37.99737172,
              lng : 23.66741002,
          },
          {
              name : "Egaleo",
              lat : 37.99160536,
              lng : 23.68211925,
          },
          {
              name : "Eleonas",
              lat : 37.98784261,
              lng : 23.69335771,
          },
          {
              name : "Keramikos",
              lat : 37.97855751,
              lng : 23.71155381,
          },
          {
              name : "Monastiraki",
              lat : 37.97608805,
              lng : 23.72561932,
          },
          {
              name : "Syntagma",
              lat : 37.97509009,
              lng : 23.73570442,
          },
          {
              name : "Evaggelismos",
              lat : 37.97617262,
              lng : 23.74716282,
          },
          {
              name : "Megaro Mousikis",
              lat : 37.9792848,
              lng : 23.75297785,
          },
          {
              name : "Ampelokipi",
              lat : 37.9873268,
              lng : 23.75704408,
          },
          {
              name : "Panormou",
              lat : 37.99316114,
              lng : 23.76341701,
          },
          {
              name : "Katehaki",
              lat : 37.99314423,
              lng : 23.77614141,
          },
          {
              name : "Ethniki Amyna",
              lat : 38.0000011,
              lng : 23.78574908,
          },
          {
              name : "Holargos",
              lat : 38.00448181,
              lng : 23.79476666,
          },
          {
              name : "Nomismatokopio",
              lat : 38.00916513,
              lng : 23.80568862,
          },
          {
              name : "Agia Paraskeui",
              lat : 38.01731374,
              lng : 23.81229758,
          },
          {
              name : "Chalandri",
              lat : 38.02162436,
              lng : 23.82027984,
          },
          {
              name : "Doukissis Plakentias",
              lat : 38.02390635,
              lng : 23.83358359,
          },
          {
              lat : 38.019426820061696,
              lng : 23.862648010253906,
          },
          {
              name : "Pallini",
              lat : 38.00568226,
              lng : 23.86961102,
          },
          {
              lat : 37.994539324697314,
              lng : 23.872604370117188,
          },
          {
              name : "Paiania Kantza",
              lat : 37.98347926,
              lng : 23.86987925,
          },
          {
              lat : 37.960981944158995,
              lng : 23.886337280273438,
          },
          {
              lat : 37.933366792504394,
              lng : 23.886337280273438,
          },
          {
              name : "Koropi",
              lat : 37.91300413,
              lng : 23.89581084,
          },
          {
              lat : 37.90709569755289,
              lng : 23.900413513183594,
          },
          {
              lat : 37.915763487770754,
              lng : 23.923416137695312,
          },
          {
              name : "Athens International Airport",
              lat : 37.93692,
              lng : 23.9448,
          },
      ]
      var stations_line2 = [
        {
              name : "Anthoupoli",
              lat : 38.01710146,
              lng : 23.69102605,
          },
          {
              name : "Peristeri",
              lat : 38.01296906,
              lng : 23.69574487,
          },
          {
              name : "Agios Antonios",
              lat : 38.0066798,
              lng : 23.69949996,
          },
          {
              name : "Sepolia",
              lat : 38.00265574,
              lng : 23.71354401,
          },
          {
              name : "Attiki",
              lat : 37.99930783,
              lng : 23.72210562,
          },
          {
              name : "Stathmos Larisis",
              lat : 37.99199008,
              lng : 23.72107565,
          },
          {
              name : "Metaksourgio",
              lat : 37.98581318,
              lng : 23.7210381,
          },
          {
              name : "Omonia",
              lat : 37.98415577,
              lng : 23.72867703,
          },
          {
              name : "Panepistimio",
              lat : 37.98033344,
              lng : 23.7330544,
          },
          {
              name : "Syntagma",
              lat : 37.97509009,
              lng : 23.73567224,
          },
          {
              name : "Akropoli",
              lat : 37.96883142,
              lng : 23.72953534,
          },
          {
              name : "Syngrou Fix",
              lat : 37.96453461,
              lng : 23.72668147,
          },
          {
              name : "Neos Kosmos",
              lat : 37.95770826,
              lng : 23.72860193,
          },
          {
              name : "Agios Ioannis",
              lat : 37.95664238,
              lng : 23.73457253,
          },
          {
              name : "Dafni",
              lat : 37.94924846,
              lng : 23.73723328,
          },
          {
              name : "Agios Dimitrios",
              lat : 37.93989925,
              lng : 23.74052167,
          },
          {
              name : "Ilioupoli",
              lat : 37.92984647,
              lng : 23.74442697,
          },
          {
              name : "Alimos",
              lat : 37.91823498,
              lng : 23.74438405,
          },
          {
              name : "Argyroupoli",
              lat : 37.90305772,
              lng : 23.74590218,
          },
          {
              name : "Elliniko",
              lat : 37.89261889,
              lng : 23.74746054,
          }
      ]
      var stations_line1 = [
          {
              name : "Piraeus",
              lat : 37.94807248,
              lng : 23.64329248,
          },
          {
              name : "Faliro",
              lat : 37.94499282,
              lng : 23.66525352,
          },
          {
              name : "Moschato",
              lat : 37.95494202,
              lng : 23.67975891,
          },
          {
              name : "Kallithea",
              lat : 37.96042365,
              lng : 23.6973542,
          },
          
          {
              name : "Tavros",
              lat : 37.9626055,
              lng : 23.70355605,
          },
          {
              name : "Petralona",
              lat : 37.9679174,
              lng : 23.70883464,
          },
          {
              name : "Thiseio",
              lat : 37.97671334,
              lng : 23.72072219,
          },
          {
              name : "Monastiraki",
              lat : 37.97610442,
              lng : 23.72565745,
          },
          {
              name : "Omonia",
              lat : 37.9841446,
              lng : 23.7286953,
          },
          {
              name : "Victoria",///
              lat : 37.99317534,
              lng : 23.73006859,
          },
          {
              name : "Attiki",
              lat : 37.99929666,
              lng : 23.72208634,
          },
          {
              name : "Agios Nikolaos",
              lat : 38.00674743,
              lng : 23.72757196,
          },
          {
              name : "Kato Patisia",
              lat : 38.01166729,
              lng : 23.72883797,
          },
          {
              name : "Agios Eleftherios",
              lat : 38.02055941,
              lng : 23.7320137,
          },
          {
              name : "Ano Patisia",
              lat : 38.02378802,
              lng : 23.73583317,
          },
          {
              name : "Perissos",
              lat : 38.03274627,
              lng : 23.74471664,
          },
          {
              name : "Pefkakia",
              lat : 38.03702218,
              lng : 23.75008106,
          },
          {
              name : "Nea Ionia",
              lat : 38.04158513,
              lng : 23.75505924,
          },
          {
              name : "Irakleio",
              lat : 38.04633368,
              lng : 23.7659812,
          },
          {
              name : "Eirini",
              lat : 38.04373976,
              lng : 23.78271818,
          },
          {
              name : "NERATZIOTISSA",
              lat : 38.04481705,
              lng : 23.79285961,
          },
          {
              name : "Marousi",
              lat : 38.05617199,
              lng : 23.80495369,
          },
          {
              name : "KAT",
              lat : 38.06595829,
              lng : 23.80383521,
          },
          {
              name : "Kifisia",
              lat : 38.07369518,
              lng : 23.80831987,
          },
      ];
      var line1 = new google.maps.Polyline({
        path: stations_line1,
        geodesic: true,
        strokeColor: '#228822',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex : 5,
        map : GoogleMaps.maps.map.instance,
      });


      var line2 = new google.maps.Polyline({
        path: stations_line2,
        geodesic: true,
        strokeColor: '#cc281c',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex : 5,
        map : GoogleMaps.maps.map.instance,
      });
      var line3 = new google.maps.Polyline({
        path: stations_line3,
        geodesic: true,
        strokeColor: '#3591da',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex : 5,
        map : GoogleMaps.maps.map.instance,
      });


      var infowindow = new google.maps.InfoWindow({
      });
      
      google.maps.event.addListener(GoogleMaps.maps.map.instance, 'click', function(e,r) {
        Session.set("maplocation",null);
        infowindow.close();
        clear_query();
        console.log(e.latLng.lat(),e.latLng.lng())
      });
      for (var i=0;i<stations_line1.length;i++){
          if (stations_line1[i].name)createCircle(stations_line1[i],infowindow);         
      }
      for (var i=0;i<stations_line2.length;i++){
          if (stations_line2[i].name)createCircle(stations_line2[i],infowindow);         
      }
      for (var i=0;i<stations_line3.length;i++){
          if (stations_line3[i].name)createCircle(stations_line3[i],infowindow);         
      }
    });
  },
  showStations : function(){
    var f = Session.get("maplocation");
    if (!f)return null;
    return (Mongo._devices.find({station_name : f}));
  }
});

function createCircle(center,infowindow){
  var cityCircle = new google.maps.Marker({
    map: GoogleMaps.maps.map.instance,
    position: center,
    draggable : false,
    zIndex : 6,
    name : center.name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      strokeWeight : 3,
      fillColor : "#FFFFFF",
      fillOpacity : 1,

    },
  });
  google.maps.event.addListener(cityCircle, 'mouseover', function(e,r) {
    Session.set("maplocation",this.name);
    infowindow.open(GoogleMaps.maps.map.instance);
    infowindow.setPosition(this.position);
    var data = getStationInfo(this.name);
    data.name = this.name;
    infowindow.setContent(Blaze.toHTMLWithData(Template.infowindow,data));   
    
    $(".infowindow").on("click",function(){
      clear_query();
      Session.set("s_station_name",data.name);
      var query = construct_query();
      var f = Mongo._devices.find(query);
      Session.set("menu","search");
      Session.set("selected_device",null)
    })
    
    $(".infowindow .st_type").on("click",function(e){
      e.stopPropagation();
      var type = $(e.target).find("#devicetype").val();
      clear_query();
      Session.set("s_station_name",data.name);
      Session.set("s_device_type",type);
      var query = construct_query();
      var f = Mongo._devices.find(query);
      Session.set("menu","search");
      Session.set("selected_device",null)
    })
  });
}