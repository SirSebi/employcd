import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Willkommen bei meiner Electron React App</h1>
      <p>Dies ist eine Beispielanwendung, die mit Electron und React erstellt wurde.</p>
      
      <div className="card">
        <h2>Funktionen</h2>
        <ul>
          <li>Cross-Plattform: Läuft auf Windows, macOS und Linux</li>
          <li>Verwendet moderne Web-Technologien wie React</li>
          <li>Einfach anzupassen und zu erweitern</li>
          <li>Mit reaktiven UI-Komponenten</li>
        </ul>
      </div>
      
      <div className="counter">
        <h2>Klick-Zähler</h2>
        <p>Sie haben <span className="count-value">{count}</span> mal geklickt</p>
        <button onClick={() => setCount(count + 1)}>Klicken</button>
      </div>
    </div>
  );
}

export default App; 