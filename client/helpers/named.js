import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"


import {construct_query} from "/client/lib/lib.js"

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
    console.log(this);
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
      console.log("this");
      // Map initialization options
      return {
        center: new google.maps.LatLng(37.961794, 23.720856),
        zoom: 12,
        minZoom: 11,
        maxZoom: 19 ,
        draggableCursor:'crosshair',
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
      console.log("asdasd");
      // Add a marker to the map once it's ready
      console.log("asdfasdf");
      var stations = [
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
              name : "Kalithea",
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
              name : "Thisio",
              lat : 37.97671334,
              lng : 23.72072219,
          },
          {
              name : "Monastiraki",
              lat : 37.97610442,
              lng : 23.72565745,
          },
          {
              name : "Syntagma",
              lat : 37.97508955,
              lng : 23.73569964,
          },
      ];
      var flightPath = new google.maps.Polyline({
        path: stations,
        geodesic: true,
        strokeColor: '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex : 5,
        map : GoogleMaps.maps.map.instance,
      });

      for (var i=0;i<stations.length;i++){
          // Add the circle for this city to the map.
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 1,
            map: GoogleMaps.maps.map.instance,
            center: stations[i],
            radius: 50,            
            zIndex : 6,
            name : stations[i].name
          });
          google.maps.event.addListener(cityCircle, 'mouseover', function(e,r) {
            console.log(e,r);
            Session.set("maplocation",this.name);
            $("#mapinfobox").show().css({top : (e.eb.pageY-$("#mapinfobox").height()-50),left : (e.eb.pageX-$("#mapinfobox").width()/2)});
          });
          google.maps.event.addListener(cityCircle, 'mouseout', function() {
            Session.set("maplocation",null);
          });   
        }
        google.maps.event.addListener(flightPath, 'mouseover', function(latlng) {
          //console.log(Mongo._devices.findOne({station_name : "Moschato"}))
          //console.log(latlng)
        });   
    });
  },
  showStations : function(){
    var f = Session.get("maplocation");
    if (!f)return null;
    return (Mongo._devices.find({station_name : f}));
  }
});
