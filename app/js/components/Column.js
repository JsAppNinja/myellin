'use strict';

var React = require('react/addons');
var cx = require('classnames');

var Column = React.createClass({

  getInitialState: function(){
    return {
      childData: null
    }
  },

  onMouseOver: function(){
    this.props.onHoverChange(this.props.number, this.state.childData, true);
  },

  onMouseOut: function(){
    this.props.onHoverChange(this.props.number, this.state.childData, false);
  },

  // Set data passed up from child (such as title for showing in navbar)
  setChildData: function(data){
    this.setState({
      childData: data
    });
  },

  render: function(){

    // Give each child a callback function so they can pass data up (such as title for showing in navbar)
    var children = React.Children.map(this.props.children, function (child) {
      return React.addons.cloneWithProps(child, {
        loadedCallback: this.setChildData
      });
    }.bind(this));

    var style = {
      float: 'left',
      height: '100vh',
      overflow: 'scroll'
    };

    var generateid = ['column-' + this.props.number];

    var siblingHoveredClass = (this.props.siblingHoveredNumber ? 'column-' + this.props.siblingHoveredNumber + '-hovered' : null);

    // See column.scss
    // Note: We may not want to style .column div at all and just use these classes to affect style of child elements
    var classes = cx('column', 'state-' + this.props.div, siblingHoveredClass, {
      'hovered': this.props.isHovered,
      // Just means it's the right-most column
      'active': this.props.active,
      // So that we can style .active column differently if another column is hovered
      // Depending on needs we could simplify by removing this and making whatever column is hovered .active
      'sibling-is-hovered': this.props.siblingIsHovered,
    });

    return (
      <div className={classes} 
          style={style} 
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          id={generateid}>

        {children}

      </div>
    );
  }
});

module.exports = Column;