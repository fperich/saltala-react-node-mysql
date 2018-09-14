import React, { Component } from 'react'


class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">

                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            {
                                !this.props.session.authenticated ?
                                    <React.Fragment>
                                        <div className="btn btn-primary text-right" onClick={() => this.props.register()}>Register</div>&nbsp;
                                        <div className="btn btn-primary text-right" onClick={() => this.props.login()}>Login</div>
                                    </React.Fragment>
                                :
                                    <React.Fragment>
                                        <div className="name">{this.props.session.user && this.props.session.user.name}</div>
                                        <div className="btn btn-primary text-right" onClick={() => this.props.logout()}>Logout</div>
                                    </React.Fragment>
                                
                            }                            
                        </form>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;