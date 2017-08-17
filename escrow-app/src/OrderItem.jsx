/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';

class OrderItem extends React.Component {
    render() {
        const {item}=this.props;
        return (<tr>
            <td>{item.title}</td>
            <td>{item.current+'/'+item.value}</td>
            <td>{item.participants}</td>
            <td>{item.current<item.value?<a href="#" onClick={this.props.join}>Join</a>:null}</td>
        </tr>)
    }
}

OrderItem.propTypes={
    join: PropTypes.func.isRequired
};

export default OrderItem