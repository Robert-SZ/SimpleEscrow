import React, {Component} from 'react';


import {ProgressBar} from 'react-bootstrap';
import EscrowService from './EscrowService';
import OrdersTable from './OrdersTable';
import CreateRequestModal from './CreateRequestModal';
import JoinRequestModal from './JoinRequestModal'

import Provider from './eth/provider';
import ConnectorFactory from './eth/ConnectorFactory';


function processMetaMaskError(error) {
    if (error && error.message.indexOf('MetaMask') > -1) {
        let errorReason = error.message.split('at')[0];
        if (errorReason) {
            return errorReason;
        }
    }
    return null;
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            loader: true,
            metaMask: {
                init: true,
                error: false,
                errorText: undefined
            },
            apiProvider: false,
            orders: {
                showEmpty: false,
                items: [],
                successfullyAdded: false
            },
            showModal: false,
            joinModal: {
                show: false,
                id: undefined
            }

        };
        let provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', new ConnectorFactory().getConnector());
        this.escrowService = new EscrowService(provider);
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
        }).catch((error) => {
            this.setState({metaMask: {...this.state.metaMask, error: true}});
            this.handleError(error);
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
        }).catch((error) => {
            this.handleError(error)
        }).then(() => {
            this.stopLoader()
        });
    }

    handleNewOrder() {
        this.setState({showModal: true});
    }

    closeModal() {
        this.setState({showModal: false});
    }

    processMetaMaskResult(code) {
        let reason = undefined;
        switch (code.toString()) {
            case '0':
                reason = 'Tx has not mined yet';
                break;
            case '1':
                reason = 'Invalid request Id';
                break;
            case '2':
                reason = 'Amount less then zero';
                break;
            case '3':
                reason = 'Request with this Id has already registred';
                break;
            case '4':
                reason = 'Join amount less then zero';
                break;
            case '5':
                reason = 'Join amount grater then 100';
                break;
            case '6':
                reason = 'Request not found';
                break;
            case '7':
                reason = 'Request amount limit exceed';
                break;
            default:
                reason = 'OK';
        }
        return reason;
    }

    handleError(error) {
        let reason = processMetaMaskError(error);
        if (reason) {
            this.setState({metaMask: {...this.state.metaMask, errorText: reason}});
        } else {
            this.setState({metaMask: {...this.state.metaMask, errorText: error.message}});
        }
        setTimeout(() => {
            this.handleHideError()
        }, 5000);
        console.error(error);
    }

    hideSuccessfullyAddedBlock() {
        this.setState({orders: {...this.state.orders, successfullyAdded: false}})
    }

    createRequest(data) {
        this.showLoader();
        this.closeModal();
        this.hideSuccessfullyAddedBlock();
        this.escrowService.createRequest(data.title, data.value)
            .then(result => {
                let errorText = this.processMetaMaskResult(result.resultCode);
                if (result.resultCode !== 10) {
                    throw new Error(errorText);
                }
                return result;
            })
            .then(newRequest => {
                this.state.orders.items.push(newRequest);
                this.setState({
                    orders: {
                        ...this.state.orders,
                        showEmpty: false,
                        successfullyAdded: true,
                        items: this.state.orders.items
                    }
                })
            }).catch((error) => {
            this.handleError(error)
        }).then(() => {
            this.stopLoader();
        });
    }

    showJoinModal(id) {
        this.setState({joinModal: {...this.state.joinModal, id: id, show: true}});
    }

    closeJoinModal() {
        this.setState({joinModal: {...this.state.joinModal, id: undefined, show: false}});
    }

    joinRequest(data) {
        this.showLoader();
        this.closeJoinModal();
        this.hideSuccessfullyAddedBlock();
        this.escrowService.join(data.itemId, data.value)
            .then(resultCode => {
                let result = this.processMetaMaskResult(resultCode);
                if (resultCode !== 10) {
                    throw new Error(result);
                }
            })
            .then(() => {
                let item = this.state.orders.items.filter(item => {
                    return item.id === data.itemId
                })[0];
                if (item) {
                    item.usedPercentage = +item.usedPercentage + (+data.value);
                    item.paticipantsCount++;
                }
                this.stopLoader();
            }).catch((error) => {
            this.handleError(error)
        }).then(() => {
            this.stopLoader();
        });
    }

    handleHideError() {
        this.setState({metaMask: {...this.state.metaMask, errorText: null}});
    }

    render() {
        const loader = <ProgressBar active now={100}/>;
        const addNewRequestBtn = <button className="btn btn-primary" disabled={this.state.loader}
                                         onClick={this.handleNewOrder.bind(this)}>Create a
            request</button>;
        const ordersTable = <OrdersTable items={this.state.orders.items} join={this.showJoinModal.bind(this)}/>;
        const emptyOrdersTable = <div className="col-6 text-center"><strong>Orders list is empty. Please add a new
            order.&nbsp;</strong>{addNewRequestBtn}</div>;
        return (
            <div>
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">The Escrow example</h1>
                        <p className="lead text-muted">It's an example of the web application to demonstrate
                            the demo escrow smart-contracts.</p>
                    </div>
                </section>
                <div className="container">
                    <div className="col-6 text-right">
                        {this.state.orders.items && this.state.orders.items.length > 0 && addNewRequestBtn}
                        <p/>
                    </div>
                    <div className="col-6 text-center">
                        {this.state.loader && loader}
                        {this.state.metaMask.init && <div><strong>Please wait while Metamask is inited</strong></div>}
                        {this.state.metaMask.error &&
                        <div className="text-danger"><strong>Can't init Metamask. Please install <a
                            href="https://metamask.io/">Metamask </a>
                            before</strong>
                        </div>}
                    </div>
                    <div className="col-6">
                        {this.state.orders.showEmpty && emptyOrdersTable}
                        {!this.state.loader && this.state.orders.items && this.state.orders.items.length > 0 && ordersTable}
                    </div>
                    {this.state.metaMask.errorText &&
                    <div className="col-6 alert alert-danger" role="alert" onClick={this.handleHideError.bind(this)}>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>Error:&nbsp;</strong>{this.state.metaMask.errorText}
                    </div>}
                    {this.state.orders.successfullyAdded &&
                    <div className="col-6 alert alert-success" role="alert"
                         onClick={this.hideSuccessfullyAddedBlock.bind(this)}>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>Well done!&nbsp;</strong>New request has been added
                    </div>}
                </div>

                {this.state.showModal &&
                <CreateRequestModal close={this.closeModal.bind(this)} save={this.createRequest.bind(this)}/>}
                {this.state.joinModal.show &&
                <JoinRequestModal itemId={this.state.joinModal.id} close={this.closeJoinModal.bind(this)}
                                  save={this.joinRequest.bind(this)}/>}

            </div>
        );
    }
}

export default App;
