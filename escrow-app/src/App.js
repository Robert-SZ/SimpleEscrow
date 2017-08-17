import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import Provider from './eth/provider';
import OrdersTable from './OrdersTable';
import CreateRequestModal from './CreateRequestModal';
import JoinRequestModal from './JoinRequestModal'

class App extends Component {

    constructor() {
        super();
        this.state = {
            metaMaskProvider: false,
            apiProvider: false,
            orders: [],
            showModal: false,
            showJoinModal: false
        };
        this.provider = new Provider();
    }

    componentDidMount() {
        this.setState({metaMaskProvider: this.provider.initMetamask()});

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
        this.state.orders.push(data);
    }

    showJoinModal() {
        this.setState({showJoinModal: true});
    }

    closeJoinModal() {
        this.setState({showJoinModal: false});
    }

    joinRequest(data) {
        this.closeModal();
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
                <div className="container"> {this.state.orders && this.state.orders.length > 0 ?
                    <OrdersTable items={this.state.orders} join={this.showJoinModal.bind(this)}/> :
                    <div><span>Orders list is empty. Please add new order</span>
                        <a href="#" className="btn btn-primary" onClick={this.handleNewOrder.bind(this)}>Create a
                            request</a></div>}</div>
                {this.state.showModal &&
                <CreateRequestModal close={this.closeModal.bind(this)} save={this.createRequest.bind(this)}/>}
                {this.state.showJoinModal &&
                <JoinRequestModal close={this.closeJoinModal.bind(this)} save={this.joinRequest.bind(this)}/>}
            </div>
        );
    }
}

export default App;
