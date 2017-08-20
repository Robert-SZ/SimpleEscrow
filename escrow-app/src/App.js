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
            loader: true,
            metaMask: {
                init: true,
                error: false
            },
            apiProvider: false,
            orders: {
                showEmpty: false,
                items: []
            },
            showModal: false,
            showJoinModal: false
        };
        this.escrowService = new EscrowService();
    }

    showLoader() {
        this.setState({loader: true});
    }

    stopLoader() {
        this.setState({loader: false});
    }

    componentDidMount() {
        this.escrowService.init().then(() => {
            this.fillOrders();
        }).catch(() => {
            this.setState({metaMask: {...this.state.metaMask, error: true}});
        }).then(() => {
            this.setState({metaMask: {...this.state.metaMask, init: false}});
            this.stopLoader();
        });

    }

    fillOrders() {
        this.showLoader();
        this.escrowService.getOrders().then(items => {
            if (items && items.length > 0) {
                this.setState({orders: {...this.state.orders, showEmpty: false, items: items}})
            } else {
                this.setState({orders: {...this.state.orders, showEmpty: true}});
            }
        }).catch(() => {
            this.handleError()
        }).then(() => {
            this.stopLoader()
        });
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

    handleError(error) {
        console.error(error);
    }

    createRequest(data) {
        this.closeModal();
        this.escrowService.createRequest(data.title, data.value, 2).then(result => {
            this.state.orders.items.push(data);
        }).catch(this.handleError);
    }

    showJoinModal() {
        this.setState({showJoinModal: true});
    }

    closeJoinModal() {
        this.setState({showJoinModal: false});
    }

    joinRequest(data) {
        this.showLoader();
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
                    this.stopLoader();
                } else {
                    //todo показать попап, что превышено число заявок
                }
            }).catch(this.handleError);
    }


    render() {
        const loader = <ProgressBar active now={100}/>;
        const ordersTable = <OrdersTable items={this.state.orders.items} join={this.showJoinModal.bind(this)}/>;
        const emptyOrdersTable = <div><span>Orders list is empty. Please add new order</span> <a
                                                                                                 className="btn btn-primary"
                                                                                                 onClick={this.handleNewOrder.bind(this)}>Create
            a request</a></div>;
        return (
            <div>
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">The Escrow example</h1>
                        <p className="lead text-muted">It's an example of the web application to demonstrate
                            smart-contracts
                            functionality.</p>
                        {/*<p>*/}
                        {/*<a href="#" className="btn btn-primary" onClick={this.handleClickMetamask.bind(this)}*/}
                        {/*disabled={!this.state.metaMaskProvider}>Use*/}
                        {/*Metamask</a>*/}
                        {/*<a href="#" className="btn btn-secondary" disabled={!this.state.metaMaskProvider}>Use*/}
                        {/*API</a>*/}
                        {/*</p>*/}

                    </div>
                </section>
                <div className="container">
                    <div></div>
                    <div className="col-6 text-center">
                        {this.state.loader && loader}
                        {this.state.metaMask.init && <div><strong>Please wait while Metamask is inited</strong></div>}
                        {this.state.metaMask.error &&
                        <div className="text-danger"><strong>Can't init Metamask. Please install Metamask
                            before</strong>
                        </div>}
                    </div>
                    {this.state.orders.showEmpty && emptyOrdersTable}
                    {!this.state.loader && this.state.orders.items && this.state.orders.items.length > 0 && ordersTable}

                    <div></div>
                </div>

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
