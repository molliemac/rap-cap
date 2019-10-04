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
          <li>
            <Link to="/topics">Topics</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
        </ul>

        <hr />
        
        <Route exact path="/" component={Home} />
        <Route path="/topics" component={Topics} />
        <Route path="/:id" component={Category} />
        
        <Route path="/categories" component={Categories} />
        
      </div>
    </Router>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

export default App;