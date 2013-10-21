//     app/assets/js/bootstrap.js v0.0.1
//     (c) 2011 Kaba AG, CC EAC
//     (by) Jan Muehlemann (jamuhl)


// Basic architecture:

// - __Models__ and __Collections__ are responsible for getting data from API
//   or emitting commands
// - Singleton _state model_ is responsible for ui state data
// - __Views__ are responsible for:
//    initialize:
//    - instantiating/fetching their models if necessary
//    - instantiating sub-views
//    - listening for state changes
//    - listening for model changes
//    render:
//    - adjusting the layout of their container boxes
//    - creating their content
//    events:
//    - listening for ui events, updating state
//    ui methods:
//    - updating ui on state change
//    - updating ui on model change
// - __Routers__ are responsible for:
//    - setting state depending on route
//    - setting route depending on state
 //   
// Process of opening a view:
//
// - URL router or UI event sets state.topview to the requested view class
// - State fires topview:change
// - AppView receives event, closes other views, calls view.open()
// - view clears previous content if necessary
// - view either renders, or fetches data and renders in the callback


// setup app
(function(myApp) {
    
    myApp.app.init = function() {
            myApp.app.persons = new myApp.collections.Persons();
            myApp.app.router = new myApp.routers.AppRouter();
            myApp.app.view = new myApp.views.AppView();
            Backbone.history.start();
    };
    
})(myApp);

// kick things off
$(myApp.app.init);
