import React, { Component } from 'react'
import Main from './Main'
import NavBar from './components/NavBar'
import axios from 'axios'
import { withRouter } from 'react-router'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: {
                authenticated: false,
                ready: false
            }
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
        this.getSession = this.getSession.bind(this);
    }

    componentDidMount() {
        this.getSession()
    }
    
    getSession(){
        axios.get('https://localhost:8081/api/session')
        .then((response) => {
            // console.log('response.data', response.data)

            const state = Object.assign(this.state, {
                session: {
                    authenticated: response.data.authenticated,
                    ready: true,
                    user: {
                        type: response.data.type,
                        id: response.data.id,
                        name: response.data.name
                    }
                }
            });

            this.setState(state)
        })
        .catch((err) => {
            console.log('err', err)
        })

    }

    login() {
        this.props.history.push('/login')
    }

    register() {
        this.props.history.push('/register')
    }

    logout(){
        axios.get('https://localhost:8081/api/logout')
        .then((response) => {

            const state = Object.assign(this.state, {
                session: {
                    authenticated: response.data.authenticated,
                    ready: true
                }
            });

            this.setState(state)
            this.props.history.push('/');
        })
        .catch((err) => {
            console.log('err', err)
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <NavBar
                    session={this.state.session}
                    login={this.login}
                    logout={this.logout}
                    register={this.register}
                    getSession={this.getSession}
                    />

                <Main 
                    session={this.state.session}
                    getSession={this.getSession} 
                />
            </div>
        )
    }
}

export default withRouter(App);