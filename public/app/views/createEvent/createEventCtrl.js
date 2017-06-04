angular.module('nWatch').controller('createEventCtrl', function($scope, eventSrvc, $log, sessionSrv, typeService ) {
  var session = () => {
    sessionSrv.session().then((res) => {
      if (res.isLoggedIn) {
        $scope.userId = res.user[0].user_id
      }
      console.log(res.followedEvents);
      $scope.attending = res.followedEvents;
      if (res.isLoggedIn) {
        $scope.hood = res.neighborhood[0].neighborhood_id;
      }
    })
  }
  typeService.getTypes().then(function (res, err) {
    console.log('types', res, err);
    $scope.lists = res.data;
    $scope.category = $scope.lists[0]
  })

  $scope.event = {};
  $scope.eventCreate = (event) => {
    event.type_id = $scope.category.type_id;
    event.event_location_lat = $scope.lat
    event.event_location_lon = $scope.long
    event.event_time = $scope.mytime.toJSON()
    event.date = $scope.dt.toDateString()
    event.photo = ''
    event.created_by = $scope.userId
    if ($scope.userId) {
      event.neighborhood_id = $scope.hood
    }
    console.log(event);
    eventSrvc.save(event)
  }
  // ui--bootstrap date js
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }
  // time picker
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    // $log.log('Time changed to: ' + $scope.mytime);
  };
  session();
})
