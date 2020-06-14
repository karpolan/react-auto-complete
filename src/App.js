import React from 'react';
import './App.css';

import { AutoCompleteClass, AutoCompleteFunc } from './components/AutoComplete';

import AutoCompleteWithDataFetch from './components/AutoCompleteWithDataFetch/AutoCompleteWithDataFetch';

function App() {
  return (
    <div className="app">
      <header className="App-header">
        <h1>AutoComplete Component for ReactJS</h1>
      </header>
      <main>
        <h2>AutoCompleteClass</h2>
        <AutoCompleteClass suggestions={['apple', 'banana', 'coconut', 'banana']} />
        <h2>AutoCompleteFunc</h2>
        <AutoCompleteFunc />

        <h2>AutoCompleteWithDataFetch</h2>
        <AutoCompleteWithDataFetch debounceInterval={500} />
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
