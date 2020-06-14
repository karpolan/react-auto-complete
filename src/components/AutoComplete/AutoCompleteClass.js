import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { replaceAll } from './utils';
import './style.css';

/**
 * Renders the text Input with autocomplete suggestions in the DropDown List
 * @param {string} props.value - input value as string
 * @param {array} props.suggestions - list of autocomplete suggestions as strings
 * @param {func} props.onChange - event callback, called as onChange(value) on every char input
 * @author Anton Karpenko
 */
class AutoCompleteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value, // Current input value
      matched: [], // Filtered props.suggestions according to current input value
      showList: false, // the DropDown list with matched is rendered when true
      selectedIndex: -1, // Index of currently selected Suggestion in the DropDown list
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
  // Updates matched and resets DropDown selection
  updateSuggestions() {
    const { suggestions } = this.props;
    const { value } = this.state;
    let newMatched;
    if (!value) {
      newMatched = [...suggestions];
    } else {
      newMatched = suggestions.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
    }
    this.setState({ matched: newMatched, selectedIndex: -1 });
  }

  // Calls props.onChange() if set, also updates matched
  doOnChange() {
    const { onChange } = this.props;
    const { value } = this.state;
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }

    this.updateSuggestions();
  }

  // Called on every Char the User enters
  handleOnChange = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.value;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    this.setState(
      {
        value: newValue,
        showList: true, // Something new were typed, so show DropDown list again
      },
      () => this.doOnChange() // Call the Event after the State was changed
    );
  };

  // Tracks Esc, Enter, Tab, Space and Arrow keys
  handleKeyDown = (event) => {
    const { matched, showList, selectedIndex } = this.state;
    let newSelectedIndex = selectedIndex;

    switch (event.keyCode) {
      case 27: // Esc pressed
        // Close the DropDown list
        this.setState({ showList: false, selectedIndex: -1 });
        return; // Thats all for now

      case 13: // Enter pressed
        if (!showList) {
          // Just open DropDown on first press
          this.setState({ showList: true });
          return;
        }
      // Note: No break here!!!

      case 9: // Tab pressed
      case 32: // Space pressed
        if (selectedIndex >= 0 && selectedIndex < matched.length) {
          // Apply currently selected Item, close the DropDown list, stop event propagation, call OnChange event
          event.preventDefault();
          this.setState(
            { value: matched[selectedIndex], selectedIndex: -1, showList: false },
            () => this.doOnChange() // Call the Event after the State was changed
          );
        }
        return; // Thats all for now

      case 38: // ArrowUp pressed
        if (!showList) {
          // Just open DropDown on first press
          this.setState({ showList: true });
          return;
        }

        // Select Prev
        newSelectedIndex = Math.max(selectedIndex - 1, 0);
        break;

      case 40: // ArrowDown pressed
        if (!showList) {
          // Just open DropDown on first press
          this.setState({ showList: true });
          return;
        }

        // Select Next
        newSelectedIndex = Math.min(selectedIndex + 1, matched.length - 1);
        break;
    }

    // Set new selectedIndex and make sure the DropDown is shown
    this.setState({ selectedIndex: newSelectedIndex, showList: true });
  };

  // Called when the User clicks some Item in DropDown list
  handleOnItemClick = (event) => {
    const { value } = this.state;
    const newValue = event.currentTarget.innerText;

    if (newValue === value) {
      return; // Nothing was changed...
    }

    // Set new value and hide the DropDown list
    this.setState({ value: newValue, showList: false });
  };

  // Renders given Text by replacing all subSting occurrences with <span class="highlight">subSting</span>
  renderHighlightedText(text, subSting) {
    const replaceWith = `<span class="highlight">${subSting}</span>`;
    const result = replaceAll(text, subSting, replaceWith);
    return result;
  }

  // Renders a list of currently matched Suggestions
  renderSuggestions() {
    const { value, matched, showList, selectedIndex } = this.state;

    if (!showList || matched.length < 1) {
      return null; // Nothing to render
    }

    return (
      <ul className="suggestions">
        {matched.map((item, index) => (
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
