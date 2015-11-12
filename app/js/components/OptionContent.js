'use strict';

var React = require('react/addons');

var Button = require('react-bootstrap').Button; 
var Glyphicon= require('react-bootstrap').Glyphicon;
var Router = require('react-router');

var OptionEditor = require('./OptionEditor');
var Editor = require('react-medium-editor');

var UpvoteButton = require('./UpvoteButton');
var AuthorName = require('./AuthorName');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

//var OptionDescription = require('./OptionDescription');
var OptionDescription = require('./OptionDescriptionFancy');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');
var AuthMixin = require('./../mixins/AuthMixin.js');



var OptionContent = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      descriptionDuringEdit: (this.props.data.description || '')
    };
  },

  _getMenuItems: function(){

    var menuItems = [];

    if (!this.state.user)
      return [];

    // If user is author
    if (this.state.user.id === this.props.data.author_id){
      menuItems.push( <MenuItem eventKey='edit'>Edit</MenuItem> );
    }

    // If user is author OR admin
    if (this.state.user.id === this.props.data.author_id || this.state.user.admin === true){
        menuItems.push( <MenuItem eventKey='delete'>Delete</MenuItem> );
    }

    // If user is parent playlist author
    // (If they aren't playlist author they should not be able to set its chosen_option)
    if (this.props.playlist && this.state.user.id === this.props.playlist.author_id)
      menuItems.push( <MenuItem eventKey='switch'>Switch</MenuItem> );

    return menuItems;
  },

  _save: function(){

    /*
    if (!this.refs.description)
      return false;

    var description = React.findDOMNode(this.refs.description).value.trim();
    */

    var description = this.state.descriptionDuringEdit;
    this.props.onSave(description);
  },

  _cancel: function(){

    this.props.onCancel();
  },

  _handleChange: function(text) {

    // Save edited description to state
    this.setState({ descriptionDuringEdit: text });

    // Pass edited description up to Option component
    if (this.props.onDescriptionChange)
      this.props.onDescriptionChange(text);
  },

  _userIsAuthor: function(){
    return (this.state.user && this.state.user.id === this.props.data.author_id);
  },

  render: function () {

    var menuItems = this._getMenuItems();

    var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

    var editable = false;
    if (this._userIsAuthor() && this.props.editable){
      editable = true;
    }

    /*
    // Testing rendering of urlEmbed components and then passing into React Editor
    // Issue is that adds a lot of extra DOM nodes
    var editText = this.props.data.description;
    var editText = React.renderToStaticMarkup(
      <OptionDescription text={this.props.data.description} />
    );
    */

    /** DISPLAY INLINE under Suboutcome **/
    if (this.props.contentOnly){
      return (
        <div>

          <div style={{background: '#CDCDCD', color: '#fff', lineHeight: '3em'}}>
            <AuthorName id={this.props.data.author_id} />
          </div>

          { !editable &&
            <div>
              <OptionDescription text={this.props.data.description} />
            </div>
          }

          { editable &&
            <div>
              <OptionEditor
                text={this.props.data.description}
                onChange={this._handleChange} />
            </div>
          }

        </div>
      );
    }

    /** DISPLAY in Options column **/
    return (

      <div className="option-container">

         <div className="alternativeauthor">
         <div className="listnumber">{this.props.number}.</div>
          <div className="count">{this.props.relationData.upvote_count + 3}0% relevant</div>
        </div>  

        <AuthorName id={this.props.data.author_id} />
        
        { !editable &&
          <div style={{ lineHeight: "1.2"}}>
            <OptionDescription text={this.props.data.description} />
          </div>
        }
         <div className="upvotediv">
        <div className="upvote">
        <UpvoteButton 
            label={<Glyphicon glyph='ok-circle'/>}
            this_type="option"
            this_id={this.props.data['.key']} 
            parent_type="suboutcome"
            parent_id={this.props.relationData.parent_suboutcome_id} />
        </div>
<div className="alternativetext">I found this the most useful alternative for this learning step.</div>
        </div>

        { editable &&
          <div>

            <OptionEditor
              text={this.props.data.description}
              onChange={this._handleChange} />
    
            <div>
              <Button onClick={this._save} style={{marginTop:'2em'}}>
                Save
              </Button>

              <Button onClick={this._cancel} style={{marginTop:'2em', marginLeft: '2em'}}>
                Cancel
              </Button>
            </div>
          </div>
        }

        { !editable && menuItems.length >= 1 &&
          <div style={{ float: 'right'}}>
            <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}} onSelect={this.props.onMenuSelect} bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
              {menuItems}
            </DropdownButton>
          </div>
        }
        
      </div>
    );
        
  }

});

module.exports = OptionContent;
