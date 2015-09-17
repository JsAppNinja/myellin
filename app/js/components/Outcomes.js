'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');

require('firebase');
var ReactFireMixin = require('reactfire');

var Outcomes = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  componentWillMount: function() {
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.refOutcomes = new Firebase(firebaseRoot + '/outcomes');
    this.bindAsArray(this.refOutcomes, 'outcomes');
  },

  addOutcomeSubmit: function(e){
    e.preventDefault();

    this.addOutcome();
  },

  addOutcome: function(){

    var title = React.findDOMNode(this.refs.createOutcome).value.trim();

    if (!title)
      return false;

    var newRef = this.refOutcomes.push({ title: title });
    var outcomeId = newRef.key();

    // Clear input
    React.findDOMNode(this.refs.createOutcome).value = '';
  },

  render: function () {

    var createOutcome = (
      <ListGroupItem className="create-outcome" href="javascript:void(0)" key="create">
       <form onSubmit={this.addOutcomeSubmit}>
          <input ref="createOutcome" placeholder="Add an outcome. Hit enter." type="text" style={{width:'100%'}} />
        </form>
      </ListGroupItem>
    );

    var elements = this.state.outcomes.map(function (outcome) {
      return (
        <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, outcome['.key'])} key={outcome['.key']}>
          {outcome.title}
          <Badge>{outcome.playlist_count}</Badge>
        </ListGroupItem>
      );
    }.bind(this));

    return (
      <ListGroup fill>
        {createOutcome}
        {elements}
      </ListGroup>
    );
  },

  _handleClick: function (id) {
    this.context.router.transitionTo('Outcomes', {outcome_id: id});
  }

});

module.exports = Outcomes;