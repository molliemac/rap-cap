import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Categories from './Categories';
import Category from './Category';
import Home from './Home';
import Test from './Test';

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>

        <hr />
        
        <Route exact path="/" component={Home} />
        
        <Route path="/:id" component={Category} />
        
      </div>
    </Router>
  );
}

export default App;