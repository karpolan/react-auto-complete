import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { replaceAll } from './utils';
import './style.css';

/**
 * Renders the text Input with autocomplete suggestions in the DropDown List
 * @class AutoCompleteFunc
 * @param {string} props.value - input value as string
 * @param {array} props.suggestions - list of autocomplete suggestions as strings
 * @param {func} props.onChange - event callback, called as onChange(value) on every char input
 * @author Anton Karpenko
 */
const AutoCompleteFunc = (props) => {
  const { suggestions = [], onChange } = props;
  const [value, setValue] = useState(props.value || ''); // Current input value
  const [matched, setMatched] = useState([]); // Filtered props.suggestions according to current input value
  const [showList, setShowList] = useState(false); // the list with matched suggestions is rendered when true
  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of currently selected Suggestion in the list

  useEffect(() => {
    updateSuggestions();
  }, []);

  // Updates matched Suggestions and resets the list selection
  function updateSuggestions(newValue) {
    let newMatched;
    if (!newValue) {
      newMatched = [...suggestions];
    } else {
      newMatched = suggestions.filter((item) => item.toLowerCase().includes(newValue.toLowerCase()));
    }
    setMatched(newMatched);
    setSelectedIndex(-1);
  }

  // Calls props.onChange() if set, also updates matched Suggestions
  function doOnChange(newValue) {
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
    updateSuggestions(newValue);
  }

  // Called on every Char the User enters
  const handleOnChange = (event) => {
    const newValue = event.currentTarget.value;
    if (newValue !== value) {
      setValue(newValue);
      setShowList(true); // Something new were typed, so show DropDown list again
      doOnChange(newValue);
    }
  };

  // Tracks Esc, Enter, Tab, Space and Arrow keys
  const handleKeyDown = (event) => {
    let newSelectedIndex = selectedIndex;

    switch (event.keyCode) {
      case 27: // Esc pressed
        // Close the DropDown list
        setShowList(false);
        setSelectedIndex(-1);
        return; // Thats all for now

      case 13: // Enter pressed
        if (!showList) {
          // Just open DropDown on first press
          setShowList(true);
          return;
        }
      // Note: No break here!!!

      case 9: // Tab pressed
      case 32: // Space pressed
        if (selectedIndex >= 0 && selectedIndex < matched.length) {
          // Apply currently selected Item, close the DropDown list, stop event propagation, call OnChange event
          event.preventDefault();
          setValue(matched[selectedIndex]);
          setShowList(false);
          setSelectedIndex(-1);
          doOnChange();
        }
        return; // Thats all for now

      case 38: // ArrowUp pressed
        if (!showList) {
          // Just open DropDown on first press
          setShowList(true);
          return;
        }

        // Select Prev
        newSelectedIndex = Math.max(selectedIndex - 1, 0);
        break;

      case 40: // ArrowDown pressed
        if (!showList) {
          // Just open DropDown on first press
          setShowList(true);
          return;
        }

        // Select Next
        newSelectedIndex = Math.min(selectedIndex + 1, matched.length - 1);
        break;
    }

    // Set new selectedIndex and make sure the DropDown is shown
    setSelectedIndex(newSelectedIndex);
    setShowList(true);
  };

  // Called when the User clicks some Item in DropDown list
  const handleOnItemClick = (event) => {
    const newValue = event.currentTarget.innerText;
    if (newValue !== value) {
      // Set new value and hide the DropDown list
      setValue(newValue);
      setShowList(false);
    }
  };

  // Renders given Text by replacing all subSting occurrences with <span class="highlight">subSting</span>
  function renderHighlightedText(text, subSting) {
    return replaceAll(text, subSting, `<span class="highlight">${subSting}</span>`);
  }

  // Renders a list of currently matched Suggestions
  function renderSuggestions() {
    if (!showList || matched.length < 1) {
      return null; // Nothing to render
    }

    return (
      <ul className="suggestions">
        {matched.map((item, index) => (
          <li
            key={`item-${item}-${index}`}
            className={index === selectedIndex ? 'selected' : ''}
            dangerouslySetInnerHTML={{ __html: renderHighlightedText(item, value) }}
            onClick={handleOnItemClick}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="autocomplete">
      <input className="value" type="text" value={value} onChange={handleOnChange} onKeyDown={handleKeyDown} />
      {renderSuggestions()}
    </div>
  );
};

AutoCompleteFunc.propTypes = {
  value: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default AutoCompleteFunc;
