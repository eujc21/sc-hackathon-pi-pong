import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import Layout from 'layout'

const App = (props) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}></Route>
    </Router>
  )
}

export default App
