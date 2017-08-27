import PropTypes from 'prop-types';

export default {
    id: PropTypes.number.isRequired,
    usedPercentage: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    paticipantsCount: PropTypes.number.isRequired,
}