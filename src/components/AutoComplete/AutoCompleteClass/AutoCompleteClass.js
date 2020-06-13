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

  /**
   * Called on every key/char the user enters
   */
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

  /**
   * Filters suggestions according to current user input
   */
  filterSuggestion = (item, index, all) => {
    const { value } = this.state;
    const itemContainsValue = item.toLowerCase().includes(value.toLowerCase());
    return itemContainsValue;
  };

  /**
   * Renders given Text but replaces subSting with <span class="highlight">subSting</span>
   */
  renderHighlightedText(text, subSting) {
    // Todo: Move to utils or use optimized function from some popular library
    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }

    const replaceWith = `<span class="highlight">${subSting}</span>`;
    return replaceAll(text, subSting, replaceWith);
  }

  /**
   * Renders a list of currently matched suggestions
   */
  renderSuggestions() {
    const { suggestions } = this.props;
    const { value } = this.state;
    const itemsToRender = suggestions.filter(this.filterSuggestion);
    return (
      <ul>
        {itemsToRender.map((item, index) => (
          <li
            key={`item-${item}-${index}`}
            dangerouslySetInnerHTML={{ __html: this.renderHighlightedText(item, value) }}
          />
        ))}
      </ul>
    );
  }

  /**
   * Renders a component composition depending on current user input
   */
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
  suggestions: ['apple', 'banana', 'coconut', 'banana'], // Remove in release!!!
};

export default AutoCompleteClass;
