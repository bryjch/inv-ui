import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Fallout from '@views/fallout'
import Texter from '@views/texter'

const Home = () => {
  return (
    <div>
      <Link to="/fallout" className="mx-3">
        Fallout
      </Link>
    </div>
  )
}

function App() {
  return (
    <div id="app">
      <Router>
        <Switch>
          <Route path="/fallout" component={Fallout} />
          <Route path="/texter" component={Texter} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>

      <style jsx>{`
        #app {
          display: flex;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default App
