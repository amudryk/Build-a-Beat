import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Editor from "./Editor";
import Selection from "./components/Selection";
import Begin from "./components/Begin";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Begin} />
        {/* <Route path="/" exact component={Selection} /> */}
        <Route path="/selection" component={Selection} />
        <Route path="/editor" component={Editor} />
      </div>
    </Router>
  );
}

export default App;
