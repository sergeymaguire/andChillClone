$(document).ready(function () {
  var config = {
    apiKey: "AIzaSyBXh_OSGPOTI4ZxdxcJL5dcV3oByDTTVwc",
    authDomain: "andchill-eb480.firebaseapp.com",
    databaseURL: "https://andchill-eb480.firebaseio.com",
    projectId: "andchill-eb480",
    storageBucket: "andchill-eb480.appspot.com",
    messagingSenderId: "198184378958"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  $("#find-movie").on("click", function (event) {
    var movieSearch = $("#movie-input")
      .val()
      .trim();

    event.preventDefault();

    if (!movieSearch) return;
    var queryURL =
      "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?";
    var queryString = queryURL + "country=" + "us" + "&term=" + movieSearch;
    getMovies(queryString);
  });

  function getMovies(queryURL) {
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        "X-Mashape-Key": "dEFISQiTvwmshEJAWU2KwJRqazW0p1I0lb0jsn5LUpy7owpPJ6",
        Accept: "application/json"
      }
    }).success(function (response) {
      console.log(response);
      $("#movies").empty();
      if ($.isArray(response.results) && response.results.length) {
        var html = buildHtml(response.results);
        $("#movies").append(html);
        addMoviesToFirebase(response.results);
      }
    });
  }

  function buildHtml(results) {
    var html = " <div class='row text-center text-lg-left'>";

    for (var i = 0; i < results.length; i++) {
      if (results[i].picture) {
        html =
          html +
          "<div class='col-lg-3 col-md-4 col-xs-6'>" +
          "<img src='" +
          results[i].picture +
          "'><div>" +
          results[i].name +
          "</div>Showing at: " +
          getLocationsHtml(results[i].locations) +
          "</div>";
      } else {
        html =
          html +
          "<div class='col-lg-3 col-md-4 col-xs-6'>" +
          "<div>" +
          results[i].name +
          "</div>Showing at: " +
          getLocationsHtml(results[i].locations) +
          "</div>";
      }
    }
    html = html + "</div>";
    return html;
  }

  function getLocationsHtml(locations) {
    var html = "";
    for (var i = 0; i < locations.length; i++) {
      html =
        html +
        "<a  target='blank' href=" +
        locations[i].url +
        ">" +
        "<br>" +
        locations[i].display_name +
        "</a>";
    }
    return html;
  }

  function addMoviesToFirebase(results) {
    for (var i = 0; i < results.length; i++) {
      database.ref().push({
        name: results[i].name,
        FindOn: results[i].locations[0].display_name,
        Image: results[i].picture
        //phoneNumber:
        //LocationAddress:
        //LocationName:
      });
    }
  }
});

//Gets the current location lat/lon

var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDB8oKKFdugWo4hKPNthhL1ouMovHmJ_Is"
$.ajax({
  url: queryURL,
  method: "POST"
}).then(function (response) {
  console.log(response.location.lat);
  console.log(response.location.lng)


  var lat = response.location.lat
  var lng = response.location.lng

  var queryGURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDB8oKKFdugWo4hKPNthhL1ouMovHmJ_Is"

  //get nearby locations

  $.ajax({
    url: queryGURL,
    method: "GET"
  }).then(function (response) {
    console.log(response.results[3].address_components[0].long_name);

    var areaName = response.results[3].address_components[0].long_name
    var YqueryURL = "https://dl-yelp-help.herokuapp.com/yelp?zip=" + areaName

    $.ajax({
      url: YqueryURL,
      method: "GET"
    }).then(function (response) {
      $("#find-movie").on("dblclick", function () {
        for (var i = 0; i < response.length; i++) {
          var html = ""
          html = html + "<p class='food'>" + response[i].name + "</p>" + "<p class='food'>" + response[i].display_phone + "</p>" + "<p class='food'>" + response[i].price + "</p>"
          $("#restaurant").append(html);
        }

      });
    });
  });
});