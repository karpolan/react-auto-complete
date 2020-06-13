import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the text Input with autocomplete suggestions List
 * @param {array} suggestions - list of autocomplete suggestions as strings
 * @author Anton Karpenko
 */
class AutoCompleteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '', // User input
      showSuggestions: false, // the Suggestions list is rendered when true
    };
  }

  onChange = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.value;
    if (newValue === value) {
      return; // Nothing was changed...
    }

    this.setState({
      value: newValue,
      showSuggestions: Boolean(newValue), // true when non-empty
    });
  };

  filterSuggestion = (item, index, all) => {
    return index !== 1;
  };

  renderSuggestions() {
    const { suggestions } = this.props;
    const itemsToRender = suggestions.filter(this.filterSuggestion);
    return (
      <ul>
        {itemsToRender.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    );
  }

  render() {
    const { value, showSuggestions } = this.state;
    return (
      <>
        <input type="text" value={value} onChange={this.onChange} />
        {showSuggestions && this.renderSuggestions()}
      </>
    );
  }
}

AutoCompleteClass.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

AutoCompleteClass.defaultProps = {
  suggestions: ['apple', 'banana', 'coconut'], // Remove in release!!!
};

export default AutoCompleteClass;
