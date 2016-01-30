'use strict';

var React         = require('react');
var Link          = require('react-router').Link;
var DocumentTitle = require('react-document-title');



var HomePage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <DocumentTitle title="Home">
        <section className="home-page">

          <div>
            <Link to="Search"></Link>
          </div>
          
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = HomePage;