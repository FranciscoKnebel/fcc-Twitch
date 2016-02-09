var apiURL = 'https://api.twitch.tv/kraken/';
var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","brunofin","comster404","test_channel","cretetion","sheevergaming","TR7K", "RuneScape", "iTrolledU"];

var app = angular.module('streamFinder', []);
app.controller('RunescapeController', function($scope, $http) {
  var callback = '&callback=JSON_CALLBACK';

  $scope.results = [];
  $http.jsonp(apiURL + 'streams?game=RuneScape' + callback)
  .success(function(data) {
    var streams = data.streams;
    $scope.results = buildStreams(streams);
    console.log($scope.results[0]);
  });
});

app.controller('userController', function($scope, $http) {
  var callback = '?callback=JSON_CALLBACK';

  $scope.results = [];
  $scope.streaming = [];
  $scope.notstreaming = [];
  channels.forEach(function(channel) {
    $http.jsonp(apiURL + 'streams/' + channel + callback)  //Check if channel is streaming
    .success(function(data) {
      var streaming;
      var stream;
      var channelData;

      if(data.stream === undefined || data.stream === null) { // Channel is not streaming
        streaming = false;
        stream = null;
      }
      else {  // Channel is streaming
        streaming = true;
        stream = buildSingleStream(data.stream);
      }

      $http.jsonp(apiURL + 'channels/' + channel + callback) //Get channel information
      .success(function(data) {
        channelData = data;

        if(streaming === true) {
          $scope.streaming.push({streaming, stream, channelData});
        }
        else if (channelData.status === 422){
          $scope.notstreaming.push({streaming, stream, channelData});

        }
        else {
          $scope.notstreaming.push({streaming, stream, channelData});
          console.log({streaming, stream, channelData});
        }

      });
    });
  });
});

function buildStreams(streams) {
  var results = [];
  angular.forEach(streams, function(stream) {
    results.push(buildSingleStream(stream));
  });

  return results;
}

function buildSingleStream(stream) {
  var result = {
    display: stream.channel.display_name,
    name: stream.channel.name,
    logo: stream.channel.logo,
    followers: stream.channel.followers,
    url: stream.channel.url,
    game: stream.game,
    viewers: stream.viewers,
    status: stream.channel.status
  };

  return result;
}
