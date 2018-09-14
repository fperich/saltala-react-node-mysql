import React, { Component } from 'react'
import axios from 'axios';

class UpdateTicket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_user: 0,
            ticket_pedido: '',
            users: [],
            ready: false
        };

        this.save = this.save.bind(this);
        this.getTicket = this.getTicket.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.changePedido = this.changePedido.bind(this);
        this.changeUsuario = this.changeUsuario.bind(this);
    }

    componentDidMount() {
        axios.all([this.getTicket(), this.getUsers()])
        .then(axios.spread((ticket, users) => {

            this.setState({
                users: users.data,
                id_user: ticket.data[0].id_user,
                ticket_pedido: ticket.data[0].ticket_pedido,
                ready: true
            });
        }))
    }
    

    getTicket(){
        return axios.get('https://localhost:8081/api/ticket/' + this.props.match.params.id);
    }

    getUsers() {
        return axios.get('https://localhost:8081/api/users');
    }

    save(e) {
        e.preventDefault();

        const usuario = this.refs.usuario.value;
        const pedido = this.refs.pedido.value;

        axios.put('https://localhost:8081/api/ticket/' + this.props.match.params.id, {
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

    changeUsuario(e){
        const usuario = this.refs.usuario.value;

        this.setState({
            id_user: usuario
        })
    }

    changePedido(e){
        const pedido = this.refs.pedido.value;

        this.setState({
            ticket_pedido: pedido
        })
    }

    render() {

        if(!this.state.ready){
            return null;
        }

        return (
            <div className="row">

                <div className="col">
                    <div className="back btn btn-primary" onClick={() => this.props.history.push('/')}>Volver</div>
                </div>

                <div className="col">

                    <form className="form-signin" onSubmit={this.save}>
                        <img className="mb-4" src="" alt="" width="72" height="72" />

                        <h1 className="h3 mb-3 font-weight-normal">Update Ticket</h1>

                        <label htmlFor="inputUser" className="sr-only">Usuario</label>
                        <select id="inputUser" className="form-control" required="" ref="usuario" value={this.state.id_user} onChange={this.changeUsuario}>
                            <option value="0">Seleccionar</option>

                            {
                                this.state.users.map((u) => {
                                    return <option value={u.id}>{u.nombre}</option>
                                })
                            }
                        </select>

                        <label htmlFor="inputPedido" className="sr-only">Ticket Pedido</label>
                        <input type="text" id="inputPedido" className="form-control" placeholder="Pedido" required="" ref="pedido" value={this.state.ticket_pedido} onChange={this.changePedido} />

                        <button className="btn btn-lg btn-primary btn-block" type="submit">Save</button>
                    </form>
                </div>

                <div className="col"></div>
            </div>
        );
    }
}

export default UpdateTicket;