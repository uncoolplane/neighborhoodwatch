module.exports = {
  getEvent: (req, res, next) => {
    var db = req.app.get('db');
     var event_id = req.params.id;

     db.get_event([event_id], (err, resp) => {
         if (err) {
             res.status(420).json(err);
         } else {
             res.send(resp);
         }
     })
   },
   getEvents: (req, res, next) => {
     var db = req.app.get('db');
       db.get_events((err, resp) => {
           if(err) {
           res.send(420).json(err);
           } else {
               res.send(resp);
           }
       })
   },
   createEvent: (req, res, next) => {
       var db = req.app.get('db');
        var event = req.body;

        var details = event.details;
        var title = event.title;
        var type_id = event.type_id;
        var created_by = event.created_by;
        var event_location_lat = event.event_location_lat;
        var event_location_lon = event.event_location_lon;
        var event_time = event.event_time;
        var photo = event.photo;
        var date = event.date;
        var event_place = event.event_place
        var neighborhood_id = event.neighborhood_id;
        //make sure to add ^ this back in this temp change
        db.create_event([details, title, type_id, created_by, event_location_lat, event_location_lon, event_time,  photo, event_place, date, neighborhood_id], (err, resp) => {
          console.log("func is runnung");
            if (err) {
                res.status(420).json(err);
            } else {
                console.log('event created:', resp)
                res.send(resp)
            }
        })
    },
    updateEvent: (req, res, next) => {
      var db = req.app.get('db');
      var event_id = req.params.id;
      var event = req.body;

      var details = event.details;
      var title = event.title;
      var type_id = event.type_id;
      var created_by = event.created_by;
      var event_location_lat = event.event_location_lat;
      var event_location_lon = event.event_location_lon;
      var event_time = event.event_time;
      var photo = event.photo;
      var curdate = event.date;
      var neighborhood_id = event.neighborhood_id;
      var event_place = event.event_place;

      db.update_event([details, title, type_id, created_by, event_location_lat, event_location_lon, event_time, photo, event_place, curdate, neighborhood_id, event_id], (err, resp) => {
          if (err) {
              res.status(420).json(err);
          } else {
              console.log('event updated:', resp)

              res.send(resp)
          }
      })
    },
    deleteEvent: (req, res, next) => {
      var db = req.app.get('db');
      var event_id = req.params.id;

      db.delete_event([event_id], (err, resp) => {
          if (err) {
              res.status(420).json(err);
          } else {
              console.log('deleted event:', resp)

              res.send(resp)
          }
      })
    },
    getFollowers: (req, res, next) => {
      var db = req.app.get('db');
      var event_Id = req.params.id;
      db.get_event_followers([event_Id], (err, resp) => {
          if (err) {
              res.status(420).json(err);
          } else {
              res.send(resp)
          }
      })
    },
    createFollowers: (req, res, next) => {
      var upfol = req.session.followedEvents
      var db = req.app.get('db');
      var user = req.body.user_id;
      var attending = req.body.attending;
      var event_Id = req.params.id;
      db.create_event_followers([event_Id, user, attending], (err, resp) => {
        console.log(req.session);
          if (err) {
              res.status(420).json(err);
          } else {
            req.session.followedEvents.push(resp[0])
            console.log('followers for event:', resp[0])
            // for (var i = 0; i < upfol.length; i++) {
            //   console.log("in for");
            //   if (upfol[i].event_id != resp[0].event_id) {
            //     req.session.followedEvents.push(resp[0])
            //       upfol[i].attending = resp[0].attending
            //     if (upfol.attending !== resp[0].attending) {
            //     }
            //   }
            // }
              res.send(resp)
          }
      })
    },
    updateFollowers: (req, res, next) => {
      var db = req.app.get('db');
      var user = req.body.user_id;
      var attending = req.body.attending
      var event_Id = req.params.id;
      var fol_id = req.body.following_id
      var foleven = req.session.followedEvents
      // function add(name, arr) {
      //   var id = arr.length + 1;
      //   var found = arr.some(function (el) {
      //     return el.following_id === name;
      //   });
      //   if (!found) {
      //       return true;
      //       console.log("this is server true");
      //   }
      //   else if(found){
      //   	return false
      //     console.log("this is server false");
      //   }
      // }
      // if (add(fol_id, foleven)) {
        db.update_event_followers([event_Id, user, attending, fol_id], (err, resp) => {
          console.log('update followers for event:', resp)
          if (err) {
            res.status(420).json(err);
          } else {
            for (var i = 0; i < foleven.length; i++) {
              if (foleven[i].event_id == resp.event_id) {
                if (foleven.attending !== resp.attending) {
                  foleven[i].attending = resp.attending
                  foleven[i].following_id = resp.following_id
                }
              }
            }
            res.send(resp)
          }
        })
      // }
    },
    getCreatedEvents: (req, res, next) => {
      var db = req.app.get('db');
      var user_id = req.params.id
      db.get_created_events([user_id], (err, resp) => {
        if(err) {
          res.status(420).json(err);
        } else {
          req.session.createdEvents = resp
          res.send(resp)
        }
      })
    },
    getFollowedEvents: (req, res, next) => {
      var db = req.app.get('db')
      console.log(`followed log`, req.params.id);
      var user_id = req.params.id
      db.get_events_followed([user_id], (err, resp) => {
        if(err) {
          res.status(420).json(err)
        } else {
          req.session.followedEvents = resp
          res.send(resp)
        }
      })
    },
    getEventsImAttending: (req, res, next) => {
      var db = req.app.get('db')
      console.log(`followed log`, req.params.id);
      var user_id = req.params.id
      db.get_events_followed([user_id], (err, resp) => {
        if(err) {
          res.status(420).json(err)
        } else {
          req.session.followedEvents = resp
          res.send(resp)
        }
      })
    }

}
