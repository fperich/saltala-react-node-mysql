import React, { Component } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router'

class Tickets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickets: []
        };

        this.getTickets = this.getTickets.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
        this.requestTicket = this.requestTicket.bind(this);
    }

    componentDidMount(){
        this.getTickets();
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.session.ready && this.props.session.authenticated) {
            this.getTickets();            
        }
    }
    
    

    getTickets(){
        axios.get('https://localhost:8081/api/tickets')
        .then((response) => {

            if (response.data) {
                this.setState({
                    tickets: response.data
                });
            }
        })
        .catch((err) => {
            console.log('err', err)
        })
    }

    add(){
        this.props.history.push('/tickets/new');
    }

    remove(data){
        if(!data.id){
            return;
        }

        axios.delete('https://localhost:8081/api/ticket', { 
            data: { 
                id: data.id 
            } 
        })
        .then((response) => {

            if(response.data.success){
                this.getTickets();
            }
        })
        .catch((err) => {
            console.log('err', err)
        })
    }

    update(data){
        this.props.history.push('/ticket/' + data.id);
    }

    requestTicket(){
        alert('Request ticket');
    }

    render() {
        if (!this.props.session.ready){
            return null;
        }

        if (!this.props.session.authenticated) {
            return <div>Unauthorized</div>;
        }

        return (
            <div>
                <h1>Tickets</h1>
                
                {
                    this.props.session.user.type === 1 ?
                        <div className="btn btn-primary" onClick={() => this.add()}>New Ticket</div>
                    : null
                }

                <div className="row">
                    <div className="col-md-2 bg-secondary">User</div>
                    <div className="col-md-6 bg-secondary">Ticket Pedido</div>
                    <div className="col-md-4 bg-secondary"></div>
                </div>

                {
                    this.props.session.user.type === 1 ?

                        this.state.tickets.length > 0 ?
                            this.state.tickets.map((t) => {
                                return (
                                    <div className="row">
                                        <div className="col-md-2">{t.id_user}</div>
                                        <div className="col-md-6">{t.ticket_pedido}</div>
                                        
                                        <div className="col-md-4">
                                            <div className="btn btn-info" onClick={() => this.update({ id: t.id })}>Update</div>&nbsp;
                                            
                                            <div className="btn btn-danger" onClick={() => this.remove({ id: t.id })}>Remove</div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className="row">
                                <div className="col-md-8">No hay nada</div>
                            </div>
                    :
                        this.state.tickets.length > 0 ?
                            this.state.tickets.map((t) => {
                                return (
                                    <div className="row">
                                        <div className="col-md-8">{t.ticket_pedido}</div>
                                        
                                        <div className="col-md-4">
                                            <div className="btn btn-info" onClick={() => this.requestTicket({ id: t.id })}>Request ticket</div>
                                        </div>
                                    </div>                                
                                )
                            })
                        : 
                            <div className="row">
                                <div className="col-md-8">No hay nada asignado</div>
                            </div>
                }
            </div>
        );
    }
}

export default withRouter(Tickets);