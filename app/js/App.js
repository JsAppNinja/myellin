'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var RouteHandler       = require('react-router').RouteHandler;

var CurrentUserActions = require('./actions/CurrentUserActions');
var CurrentUserStore   = require('./stores/CurrentUserStore');
var NavbarTop          = require('./components/NavbarTop');
var Footer             = require('./components/Footer');
var MainPage             = require('./pages/MainPage');



var App = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      currentUser: {}
    };
  },

  _onUserChange: function(err, user) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ currentUser: user || {}, error: null });
    }
  },

  componentWillMount: function() {
    console.log('About to mount App');
  },

  componentDidMount: function() {
    CurrentUserActions.checkLoginStatus(this._onUserChange);
    this.listenTo(CurrentUserStore, this._onUserChange);
  },

  render: function() {
    return (
      <div>
        <NavbarTop />
        <MainPage />
        <RouteHandler params={this.props.params}
                      query={this.props.query}
                      currentUser={this.state.currentUser} />

        <Footer />
      </div>
    );
  }

});

module.exports = App;