import React from 'react';
import './App.css';

import { AutoCompleteClass, AutoCompleteFunc, AutoCompleteDataController } from './components/AutoComplete';

function App() {
  return (
    <div className="app">
      <header className="App-header">
        <h1>AutoComplete Component for ReactJS</h1>
        <p>Type something or use Up/Down/Enter to open the Suggestions list</p>
      </header>
      <main>
        <section>
          <h2>AutoCompleteDataController</h2>
          <p>wrapper component to fetch data from API</p>
          <AutoCompleteDataController value="the" debounceInterval={500} />
        </section>
        <section>
          <h2>AutoCompleteClass</h2>
          <p>class component</p>
          <AutoCompleteClass value="ap" suggestions={['apple', 'banana', 'coconut', 'banana']} />
        </section>
        <section>
          <h2>AutoCompleteFunc</h2>
          <p>function component</p>
          <AutoCompleteFunc value="ba" suggestions={['apple', 'banana', 'coconut', 'banana']} />
        </section>
      </main>
      <footer>
        <p>
          Source code on{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/karpolan">
            GitHub
          </a>
        </p>
        <p>
          Copyright &copy;{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://karpolan.com">
            KARPOLAN
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
