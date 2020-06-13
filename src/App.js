import React from 'react';
import './App.css';

import { AutoCompleteClass, AutoCompleteFunc } from './components/AutoComplete';
import { getSuggestions } from './api';

function App() {
  const getData = async () => {
    const result = await getSuggestions();
    // console.log('getData() - result:', result);
    return result;
  };

  return (
    <div className="app">
      <header className="App-header">
        <h1>AutoComplete Component for ReactJS</h1>
      </header>
      <main>
        <h2>AutoCompleteClass</h2>
        <AutoCompleteClass />
        <h2>AutoCompleteFunc</h2>
        <AutoCompleteFunc />
        {JSON.stringify(getData())}
      </main>
      <footer>
        Copyright &copy;{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://karpolan.com">
          KARPOLAN
        </a>
      </footer>
    </div>
  );
}

export default App;
