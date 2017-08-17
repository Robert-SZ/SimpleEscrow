/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class CreateRequestModal extends React.Component {
    constructor(props){
        super(props);
        this.state={
            value: '',
        }
    }

    handleValue(event) {
        this.setState({value: event.target.value});
    }

    handleSave(){
        this.props.save(this.state);
    }

    render() {
        return (<div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>What % of contract can you deliver?</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">%</span>
                        <input value={this.state.title} onChange={this.handleValue.bind(this)}
                               type="text" id="input" placeholder="10" aria-describedby="basic-addon1"/>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSave.bind(this)}>Join</Button>
                </Modal.Footer>

            </Modal.Dialog>
        </div>)
    }
}

CreateRequestModal.propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};

export default CreateRequestModal;