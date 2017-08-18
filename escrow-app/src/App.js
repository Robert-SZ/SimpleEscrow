import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import {ProgressBar} from 'react-bootstrap';
import EscrowService from './EscrowService';
import OrdersTable from './OrdersTable';
import CreateRequestModal from './CreateRequestModal';
import JoinRequestModal from './JoinRequestModal'


class App extends Component {

    constructor() {
        super();
        this.state = {
            metaMaskProvider: true,
            apiProvider: false,
            orders: {
                loader: false,
                items: [{
                    title: 'A',
                    amount: '100',
                    usedPercentage: '15',
                    participantsCount: 3
                }]
            },
            showModal: false,
            showJoinModal: false
        };
        this.escrowService = new EscrowService();
    }

    componentDidMount() {
        //this.setState({metaMaskProvider: this.provider.initMetamask()});
        this.fillOrders();
    }

    fillOrders() {
        this.escrowService.getOrders().then(items => {
            this.setState({
                orders: {
                    loader: false,
                    items: items
                }
            });
        }).catch(error => {
            console.error(error);
        })
    }

    handleClickMetamask() {
        this.provider.getParticipants();
    }

    handleNewOrder() {
        this.setState({showModal: true});
    }

    closeModal() {
        this.setState({showModal: false});
    }

    createRequest(data) {
        this.closeModal();
        this.escrowService.createRequest(data.title,data.value,1),then(result=>{
            this.state.orders.items.push(data);
        });
    }

    showJoinModal() {
        this.setState({showJoinModal: true});
    }

    closeJoinModal() {
        this.setState({showJoinModal: false});
    }

    joinRequest(data) {
        this.setState({orders: {loader: true}});
        this.closeJoinModal();
        this.escrowService.join(data.itemId, data.value)
            .then((result) => {
                if (result) {
                    let item = this.state.orders.items.filter(item => {
                        return item.id === data.itemId
                    })[0];
                    if (item) {
                        item.usedPercentage += data.value;
                        item.participantsCount++;
                    }
                    this.setState({orders: {loader: false}});
                }else {
                    //todo показать попап, что превышено число заявок
                }
            })
    }


    render() {
        return (
            <div>
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">Escrow example</h1>
                        <p className="lead text-muted">It's an example web applicarin to demonstrate smart-contracts
                            functionality.</p>
                        <p>
                            <a href="#" className="btn btn-primary" onClick={this.handleClickMetamask.bind(this)}
                               disabled={!this.state.metaMaskProvider}>Use
                                Metamask</a>
                            <a href="#" className="btn btn-secondary" disabled={!this.state.metaMaskProvider}>Use
                                API</a>
                        </p>

                    </div>
                </section>
                {this.state.orders.loader && <div>
                    <div><ProgressBar active now={100}/></div>
                    <div>Loading...</div>
                </div>}
                {!this.state.orders.loader &&
                <div className="container">
                    {this.state.orders.items && this.state.orders.items.length > 0 ?
                        <OrdersTable items={this.state.orders.items} join={this.showJoinModal.bind(this)}/> :
                        <div><span>Orders list is empty. Please add new order</span>
                            <a href="#" className="btn btn-primary" onClick={this.handleNewOrder.bind(this)}>Create a
                                request</a></div>}</div>}

                {this.state.showModal &&
                <CreateRequestModal close={this.closeModal.bind(this)} save={this.createRequest.bind(this)}/>}
                {this.state.showJoinModal &&
                <JoinRequestModal itemId={1} close={this.closeJoinModal.bind(this)}
                                  save={this.joinRequest.bind(this)}/>}
            </div>
        );
    }
}

export default App;
