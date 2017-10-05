/**
 * External dependencies
 *
 * @format
 */

import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

module.exports = React.createClass( {
	displayName: 'ValidationErrorList',

	propTypes: {
		messages: PropTypes.array.isRequired,
	},

	render: function() {
		return (
			<div>
				<p>
					{ this.translate(
						'Please correct the issue below and try again.',
						'Please correct the issues listed below and try again.',
						{
							count: this.props.messages.length,
						}
					) }
				</p>
				<ul>
					{ map( this.props.messages, function( message, index ) {
						return <li key={ index }>{ message }</li>;
					} ) }
				</ul>
			</div>
		);
	},
} );
