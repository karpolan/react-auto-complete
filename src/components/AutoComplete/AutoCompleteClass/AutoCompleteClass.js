import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the text Input with autocomplete suggestions List
 * @class AutoCompleteClass
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

  renderSuggestions() {
    return <div>Suggestions list here...</div>;
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
  prop: PropTypes,
};

export default AutoCompleteClass;
