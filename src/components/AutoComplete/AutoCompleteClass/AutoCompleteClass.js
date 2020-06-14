import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style.css';

// Todo: Replace with optimized function from some popular library
function replaceAll(str, find, replace) {
  let result = str;
  try {
    result = str.replace(new RegExp(find, 'g'), replace);
  } catch (error) {
    result = str; // For text with ~\./ symbols RegExp may generate the exception
  }
  return result;
}

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
      value: props.value, // Current user input
      matchedSuggestions: [], // Filtered props.suggestions according to current input value
      showSuggestions: false, // the Suggestions list is rendered when true
      selectedIndex: -1, // Index of currently selected Suggestions in the DropDown list
    };
  }

  componentDidMount() {
    this.updateSuggestions();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.suggestions !== this.props.suggestions) {
      // props.suggestions were changed
      this.updateSuggestions();
    }
  }

  // Filters Suggestions according to current input value
  filterSuggestion = (item, index, all) => {
    const { value } = this.state;
    if (!value) {
      return true; // When value is empty all Suggestions match
    }
    const itemContainsValue = item.toLowerCase().includes(value.toLowerCase());
    return itemContainsValue;
  };

  // Updates matchedSuggestions and resets DropDown selection
  updateSuggestions() {
    const { suggestions } = this.props;
    const matchedSuggestions = suggestions.filter(this.filterSuggestion);
    this.setState({ matchedSuggestions, selectedIndex: -1 });
  }

  // Calls props.onChange() if set
  doOnChange() {
    const { onChange } = this.props;
    const { value } = this.state;
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }
  }

  // Called on every Char the User enters
  handleOnChange = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.value;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    this.updateSuggestions();
    this.setState(
      {
        value: newValue,
        showSuggestions: true, // Something new were typed, so show DropDown list again
      },
      () => this.doOnChange() // Call the Event after the State was changed
    );
  };

  // Tracks Esc, Enter, Tab, Space and Arrow keys
  handleKeyDown = (event) => {
    // console.log('handleKeyDown() - event.keyCode:', event.keyCode);
    const { matchedSuggestions, showSuggestions, selectedIndex } = this.state;
    let newSelectedIndex = selectedIndex;

    // if (matchedSuggestions.length < 1) {
    //   return; // There is no items for DropDown list
    // }

    switch (event.keyCode) {
      case 27: // Esc pressed
        // Close the DropDown list
        this.setState({ showSuggestions: false, selectedIndex: -1 });
        return;

      case 9: // Tab pressed
      case 32: // Space pressed
      case 13: // Enter pressed
        if (selectedIndex >= 0 && selectedIndex < matchedSuggestions.length) {
          // Apply currently selected Item, close the DropDown list, stop event propagation.
          event.preventDefault();
          this.setState({ value: matchedSuggestions[selectedIndex], selectedIndex: -1, showSuggestions: false });
        }
        return; // Thats all for now

      case 38: // ArrowUp pressed
        if (!showSuggestions) {
          // Just open DropDown on first press
          this.setState({ showSuggestions: true });
          return;
        }

        // Select Prev
        newSelectedIndex = Math.max(selectedIndex - 1, 0);
        break;

      case 40: // ArrowDown pressed
        if (!showSuggestions) {
          // Just open DropDown on first press
          this.setState({ showSuggestions: true });
          return;
        }

        // Select Next
        newSelectedIndex = Math.min(selectedIndex + 1, matchedSuggestions.length - 1);
        break;
    }

    // Set new selectedIndex and make sure the DropDown is shown
    this.setState({ selectedIndex: newSelectedIndex, showSuggestions: true });
  };

  // Called when the User clicks some Item in DropDown list
  handleOnItemClick = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.innerText;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    // Set new value and hide the DropDown list
    this.setState({ value: newValue, showSuggestions: false });
  };

  // Renders given Text but replaces subSting with <span class="highlight">subSting</span>
  renderHighlightedText(text, subSting) {
    const replaceWith = `<span class="highlight">${subSting}</span>`;
    return replaceAll(text, subSting, replaceWith);
  }

  // Renders a list of currently matched suggestions
  renderSuggestions() {
    const { value, matchedSuggestions, showSuggestions, selectedIndex } = this.state;

    if (!showSuggestions || matchedSuggestions.length < 1) {
      return null; // Nothing to render
    }

    return (
      <ul className="suggestions">
        {matchedSuggestions.map((item, index) => (
          <li
            key={`item-${item}-${index}`}
            className={index === selectedIndex ? 'selected' : ''}
            dangerouslySetInnerHTML={{ __html: this.renderHighlightedText(item, value) }}
            onClick={this.handleOnItemClick}
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
      <div className="autocomplete">
        <input
          className="value"
          type="text"
          value={value}
          onChange={this.handleOnChange}
          onKeyDown={this.handleKeyDown}
        />
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
};

export default AutoCompleteClass;
