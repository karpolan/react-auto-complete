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
 * Renders the text Input with autocomplete suggestions in the DropDown List
 * @param {string} props.value - input value as string
 * @param {array} props.suggestions - list of autocomplete suggestions as strings
 * @param {func} props.onChange - event callback, called as onChange(value:) on every key/char input
 * @author Anton Karpenko
 */
class AutoCompleteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value, // Current input value
      matchedSuggestions: [], // Filtered props.suggestions according to current input value
      showDropDown: false, // the DropDown list with matchedSuggestions is rendered when true
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
        showDropDown: true, // Something new were typed, so show DropDown list again
      },
      () => this.doOnChange() // Call the Event after the State was changed
    );
  };

  // Tracks Esc, Enter, Tab, Space and Arrow keys
  handleKeyDown = (event) => {
    const { matchedSuggestions, showDropDown: showDropDown, selectedIndex } = this.state;
    let newSelectedIndex = selectedIndex;

    switch (event.keyCode) {
      case 27: // Esc pressed
        // Close the DropDown list
        this.setState({ showDropDown: false, selectedIndex: -1 });
        return; // Thats all for now

      case 13: // Enter pressed
        if (!showDropDown) {
          // Just open DropDown on first press
          this.setState({ showDropDown: true });
          return;
        }
      // No break here!!!

      case 9: // Tab pressed
      case 32: // Space pressed
        if (selectedIndex >= 0 && selectedIndex < matchedSuggestions.length) {
          // Apply currently selected Item, close the DropDown list, stop event propagation, call OnChange event
          event.preventDefault();
          this.setState(
            { value: matchedSuggestions[selectedIndex], selectedIndex: -1, showDropDown: false },
            () => this.doOnChange() // Call the Event after the State was changed
          );
        }
        return; // Thats all for now

      case 38: // ArrowUp pressed
        if (!showDropDown) {
          // Just open DropDown on first press
          this.setState({ showDropDown: true });
          return;
        }

        // Select Prev
        newSelectedIndex = Math.max(selectedIndex - 1, 0);
        break;

      case 40: // ArrowDown pressed
        if (!showDropDown) {
          // Just open DropDown on first press
          this.setState({ showDropDown: true });
          return;
        }

        // Select Next
        newSelectedIndex = Math.min(selectedIndex + 1, matchedSuggestions.length - 1);
        break;
    }

    // Set new selectedIndex and make sure the DropDown is shown
    this.setState({ selectedIndex: newSelectedIndex, showDropDown: true });
  };

  // Called when the User clicks some Item in DropDown list
  handleOnItemClick = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.innerText;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    // Set new value and hide the DropDown list
    this.setState({ value: newValue, showDropDown: false });
  };

  // Renders given Text by replacing all subSting occurrences with <span class="highlight">subSting</span>
  renderHighlightedText(text, subSting) {
    const replaceWith = `<span class="highlight">${subSting}</span>`;
    const result = replaceAll(text, subSting, replaceWith);
    return result;
  }

  // Renders a list of currently matched suggestions
  renderSuggestions() {
    const { value, matchedSuggestions, showDropDown: showDropDown, selectedIndex } = this.state;

    if (!showDropDown || matchedSuggestions.length < 1) {
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

  render() {
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
