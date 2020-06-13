import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style.css';

/**
 * Renders the text Input with autocomplete suggestions List
 * @param {string} props.value - input value as strings
 * @param {array} props.suggestions - list of autocomplete suggestions as strings
 * @param {func} props.onChange - event callback, called as onChange(value:) on every key/char input
 * @author Anton Karpenko
 */
class AutoCompleteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value, // User input
    };
  }

  /**
   * Calls props.onChange() if set
   */
  doOnChange() {
    const { onChange } = this.props;
    const { value } = this.state;
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }
  }

  /**
   * Called on every key/char the user enters
   */
  handleOnChange = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.value;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    this.setState(
      {
        value: newValue,
      },
      () => this.doOnChange() // Call the Event after the State was changed
    );
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

    if (!Boolean(value) || suggestions.length < 1) {
      return null; // Nothing to render
    }

    const itemsToRender = suggestions.filter(this.filterSuggestion);
    if (itemsToRender.length < 1) {
      return null; // No items to render
    }

    return (
      <ul class="suggestions">
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
    // console.log('AutoCompleteClass.render()');
    const { value } = this.state;
    return (
      <div class="autocomplete">
        <input class="value" type="text" value={value} onChange={this.handleOnChange} />
        {this.renderSuggestions()}
      </div>
    );
  }
}

AutoCompleteClass.propTypes = {
  value: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

AutoCompleteClass.defaultProps = {
  value: '',
  suggestions: [],
  suggestions: ['apple', 'banana', 'coconut', 'banana'], // Remove in release!!!
};

export default AutoCompleteClass;
