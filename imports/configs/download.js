"use strict";

var DDPClient = require("ddp");
var fs = require('fs');
var path = require("path");
var rmdir = require('rimraf');
var mkdir = require('mkdirp');



function exit(){
  console.log("Files saved.")
  console.log("Exiting...")
  process.exit();
}

var ddpclient = new DDPClient({
  // All properties optional, defaults shown
  host : "10.233.1.100",
  port : 3000,
  ssl  : false,
  autoReconnect : false,
  autoReconnectTimer : 500,
  maintainCollections : false,
  ddpVersion : "1",  // ["1", "pre2", "pre1"] available,
  // uses the sockJs protocol to create the connection
  // this still uses websockets, but allows to get the benefits
  // from projects like meteorhacks:cluster
  // (load balancing and service discovery)
  // do not use `path` option when you are using useSockJs
  useSockJs: true,
  // Use a full url instead of a set of `host`, `port` and `ssl`
  // do not set `useSockJs` option if `url` is used
  url: 'wss://example.com/websocket'
});

/*
 * Connect to the Meteor Server
 */
console.log("Conneecting...")
ddpclient.connect(function(error, wasReconnect) {
  // If autoReconnect is true, this callback will be invoked each time
  // a server connection is re-established
  if (error) {
    console.log("DDP connection error!");
    return;
  }

  if (wasReconnect) {
    console.log("Reestablishment of a connection.");
  }

  console.log("Connected");
  var method = "getConfigs";
  if (process.argv[2]){
    method = "getConfigs3G";
  }

    ddpclient.call(
      method,             // name of Meteor Method being called
      [],            // parameters to send to Meteor Method
      function (err, result) {   // callback which returns the method call results
        if (!err){ 
          var root;
          root = __dirname;
          rmdir(root+"/../Sync/ACIM",function(e,r){
            if (e)console.log(e,r)
            else{
              var count1 = 0;
              var count2 = 0;
              var total = 0;
              Object.keys(result).forEach(function(key) {
              var val = result[key];
              if (val.ok){
                total++;
                mkdir(root+"/../Sync/ACIM/"+key,function(err){
                  if (err)console.log(err)
                  else{
                    fs.writeFile(root+"/../Sync/ACIM/"+key+"/sc001_"+key, val.data.file1, function(err) {
                      if(err) {
                          console.log(err);
                      }
                      count1++;
                      if ((count1 == total) && (count2 == total))exit();
                    }); 
                    fs.writeFile(root+"/../Sync/ACIM/"+key+"/sc002_"+key, val.data.file2, function(err) {
                      if(err) {
                          console.log(err);
                      }
                      count2++;
                      if ((count1 == total) && (count2 == total))exit();
                    }); 
                    }
                  });              
                }
                else{
                  console.log(key +" contains errors and was not created");
                }
              });
            }
          })
        }
      },
      function () {              // callback which fires when server has finished
        console.log("Got files.");  // sending any updated documents as a result of
      }
    );
});
