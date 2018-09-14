import React from 'react'
import { Switch, Route } from 'react-router'
import App from './App'
import Login from './components/Login'


<Switch>
    <Route exact path="/" component={App} />
    <Route path="/login" component={Login} />
    {/* <Route component={NoMatch} /> */}
</Switch>