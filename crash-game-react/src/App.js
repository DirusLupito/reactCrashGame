import PlotCanvas from './gambleGame/PlotCanvas';
import React, { useState } from "react";
import './App.css';

function App() {
  const [balance, setBalance] = useState(5000);
  return (
    <div className="App">
      <PlotCanvas balance={balance} setBalance={setBalance} />
    </div>
  );
}

export default App;
