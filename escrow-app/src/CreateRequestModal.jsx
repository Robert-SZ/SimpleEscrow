/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class CreateRequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            value: '',
            current: 0,
            participants: 0
        }
    }

    handleTitle(event) {
        this.setState({title: event.target.value});
    }

    handleValue(event) {
        this.setState({value: event.target.value});
    }

    handleSave(event) {
        this.props.save(this.state);
        event.preventDefault();
    }

    render() {
        return (<div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Create a request</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSave.bind(this)}>
                    <Modal.Body>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Title</span>
                            <input value={this.state.title} onChange={this.handleTitle.bind(this)}
                                   type="text" id="input" placeholder="1T of potatoes" aria-describedby="basic-addon1"
                                   required/>
                        </div>
                        <br/>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon2">Escrowed amount(eth):</span>
                            <input value={this.state.value} onChange={this.handleValue.bind(this)}
                                   type="number" min={1} max={100} id="input" placeholder="0" pattern="\d+" required aria-describedby="basic-addon2"/>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                        <Button bsStyle="primary" type="submit">Save changes</Button>
                    </Modal.Footer>
                </form>
            </Modal.Dialog>
        </div>)
    }
}

CreateRequestModal.propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};

export default CreateRequestModal;