import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Tickets from './components/Tickets'
import Login from './components/Login'
import Register from './components/Register'
import AddTicket from './components/AddTicket'
import UpdateTicket from './components/UpdateTicket'

const Main = (mainprops) => (
    <main>
        <Switch>
            <Route exact path='/' component={(props) => <Tickets {...mainprops} {...props} /> } />
            <Route exact path='/login' component={(props) => <Login {...mainprops} {...props} />} />
            <Route exact path='/register' component={(props) => <Register {...mainprops} {...props} />} />
            <Route exact path='/tickets/new' component={(props) => <AddTicket {...mainprops} {...props} />} />
            <Route exact path='/ticket/:id' component={(props) => <UpdateTicket {...mainprops} {...props} />} />
        </Switch>
    </main>
)

export default Main
