import React, { Component } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router'


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.login = this.login.bind(this)
    }

    login(e){
        e.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;

        if(email === '' || password === ''){
            return false;
        }

        axios.post('https://localhost:8081/api/login', {
            email: email,
            password: password
        })
        .then((response) => {
            // console.log('response', response)

            if(response.data.success){
                this.props.history.push('/');
                this.props.getSession();
            }
        })
        .catch((err) => {
            console.log('err', err)
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col"></div>

                <div className="col">

                    <form className="form-signin" onSubmit={this.login}>
                        <img className="mb-4" src="" alt="" width="72" height="72" />

                        <h1 className="h3 mb-3 font-weight-normal">Please log in</h1>

                        <label htmlFor="inputEmail" className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus="" ref="email" />

                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" ref="password" />

                        <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                    </form>
                </div>

                <div className="col"></div>
            </div>
        );
    }
}

export default withRouter(Login);