import React, { Component } from 'react'
import axios from 'axios'

class AddTicket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };

        this.getUsers = this.getUsers.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
        if (!this.props.session.authenticated) {
            this.props.history.push('/');
        }
    };
    

    componentDidMount(){
        if(this.props.session.authenticated){
            this.getUsers();
        } else {
            this.props.history.push('/');
        }
    }
    
    getUsers(){
        axios.get('https://localhost:8081/api/users')
        .then((response) => {

            if (response.data) {
                this.setState({
                    users: response.data
                });
            }
        })
        .catch((err) => {
            console.log('err', err)
        })
    }

    save(e){
        e.preventDefault();

        const usuario = this.refs.usuario.value;
        const pedido = this.refs.pedido.value;

        axios.post('https://localhost:8081/api/ticket', {
            usuario: usuario,
            pedido: pedido,
        })
            .then((response) => {

                if (response.data.success) {
                    this.props.history.push('/');
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

                    <form className="form-signin" onSubmit={this.save}>
                        <img className="mb-4" src="" alt="" width="72" height="72" />

                        <h1 className="h3 mb-3 font-weight-normal">Nuevo Ticket</h1>

                        <label htmlFor="inputUser" className="sr-only">Usuario</label>
                        <select id="inputUser" className="form-control" required="" ref="usuario">
                            <option value="">Seleccionar</option>

                            {
                                this.state.users.map((u) => {
                                    return <option value={ u.id }>{ u.nombre }</option>
                                })
                            }
                        </select>

                        <label htmlFor="inputPedido" className="sr-only">Ticket Pedido</label>
                        <input type="text" id="inputPedido" className="form-control" placeholder="Pedido" required="" ref="pedido" />

                        <button className="btn btn-lg btn-primary btn-block" type="submit">Save</button>
                    </form>
                </div>

                <div className="col"></div>
            </div>
        );
    }
}

export default AddTicket;