import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSuggestions } from '../../api';
import AutoComplete from '.';
import { debounce } from './utils';

/**
 * Wrapper for AutoComplete component to fetch Suggestions via API when the Value is changed
 * @param {number} props.debounceInterval - interval for "debounce" feature
 */
const AutoCompleteDataController = (props) => {
  const {
    debounceInterval = 250, // Quarter of second by default
  } = props;
  const [suggestions, setSuggestions] = useState([]); // Empty array by default

  useEffect(() => {
    fetchData(); // Fetch default data once
  }, []);

  // Calls fetchData() no frequently than debounceInterval timeout
  const debouncedHandler = useCallback(
    debounce((value) => fetchData(value), debounceInterval),
    []
  );

  // Loads suggestions list for given value from the API
  const fetchData = async (forValue) => {
    const newSuggestions = await getSuggestions(forValue);
    setSuggestions(newSuggestions);
  };

  // Comes from wrapped AutoComplete component on every char press
  const handleOnChange = (newValue) => {
    debouncedHandler(newValue);
  };

  return <AutoComplete suggestions={suggestions} onChange={handleOnChange} />;
};

AutoCompleteDataController.propTypes = {
  debounceInterval: PropTypes.number,
};

export default AutoCompleteDataController;
