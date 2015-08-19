'use strict';

var React = require('react/addons');
var Panel = require('react-bootstrap').Panel; 
var Glyphicon = require('react-bootstrap').Glyphicon; 
var Router = require('react-router');
var Option = require('./Option');
var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: null,
      expanded: false
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refSubOutcome = firebase.child('suboutcomes/' + this.props.relationData.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'data');
  },

  render: function () {

    if (!this.state.data)
      return false;

    var PanelHeader = (
      <div className="suboutcome-header">
        <div className="suboutcome-header-title" style={{float:'left'}}>
          {this.state.data.title}
        </div>
        <div className="clearfix"></div>
      </div>
    );

    var VoteButton = (
      <div className="suboutcome-body">
        <div>
          <UpvoteButton size="small" label={<Glyphicon glyph='ok-circle'/>} className="smallvoteicon"
            this_type="option"
            this_id={this.state.data.chosen_option}
            parent_type="suboutcome"
            parent_id={this.state.data.id} />
        </div>
      </div>
    );

    var containerClassNames = 'suboutcome-container';
    if (this.props.optionsShown)
      containerClassNames += ' options-shown';

    return (
      
      <div className={containerClassNames}>
        <Panel 
          header={PanelHeader}
          collapsible={true} 
          expanded={this.state.expanded}
          onSelect={this._toggleExpand}
          key={this.props.key} 
          accordion>

          { this.state.expanded && this.state.data.chosen_option >= 0 &&
            <div className="optionsicondiv">
              <Glyphicon href="javascript:void(0)" onClick={this._handleOptionsClick} glyph='option-horizontal' className="options-icon"/>
              {VoteButton}
            </div>
          }

          <div style={{borderBottom: '2px solid #ECEBEC' }} >
            <div style={{marginTop: '2.5em', marginBottom: '2em', textAlign: 'justify', fontFamily: "Akkurat-Light"}} >
              { this.state.data.chosen_option >= 0 && 
                <Option contentOnly={true} id={this.state.data.chosen_option} />
              }
            </div>
          </div>
        </Panel>
      </div>

    );

  },

  _toggleExpand: function(e){
    e.preventDefault();

    this.setState({expanded: !this.state.expanded});
  },

  loadOptions: function(){
    alert('load options');
  },

  _handleOptionsClick: function () {
    this.context.router.transitionTo('Options', {
      outcome_id: this.getParams().outcome_id,
      suboutcome_id: this.props.relationData.suboutcome_id
    });
  }
 

});

module.exports = SubOutcome;