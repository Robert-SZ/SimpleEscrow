/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class JoinRequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    handleValue(event) {
        this.setState({value: event.target.value});
    }

    handleSave(event) {
        this.props.save({...this.state, itemId: this.props.itemId});
        event.preventDefault();
    }

    render() {
        return (<div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>What % of contract can you deliver?</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSave.bind(this)}>
                    <Modal.Body>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">%</span>
                            <input value={this.state.title} onChange={this.handleValue.bind(this)}
                                   type="text" id="input" placeholder="10" aria-describedby="basic-addon1" required/>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={this.props.close}>Close</button>
                        <button className="btn btn-primary" type="submit">Join</button>
                    </Modal.Footer>
                </form>
            </Modal.Dialog>
        </div>)
    }
}

JoinRequestModal.propTypes = {
    itemId: PropTypes.number.isRequired,
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};

export default JoinRequestModal;