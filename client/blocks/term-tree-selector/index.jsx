/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import TermTreeSelectorTerms from './terms';
import TermSelectorAddTerm from './add-term';

export default class extends React.Component {
	static displayName = 'TermTreeSelector';

	static propTypes = {
		multiple: PropTypes.bool,
		className: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		selected: PropTypes.array,
		createLink: PropTypes.string,
		analyticsPrefix: PropTypes.string,
		taxonomy: PropTypes.string,
		height: PropTypes.number,
		compact: PropTypes.bool,
		addTerm: PropTypes.bool,
		postType: PropTypes.string,
		onAddTermSuccess: PropTypes.func,
	};

	static defaultProps = {
		analyticsPrefix: 'Category Selector',
		selected: [],
		taxonomy: 'category',
		onChange: () => {},
		height: 300,
		addTerm: false,
		postType: 'post',
		onAddTermSuccess: () => {},
	};

	state = {
		search: '',
	};

	onSearch = searchTerm => {
		if ( searchTerm !== this.state.search ) {
			this.setState( {
				search: searchTerm,
			} );
		}
	};

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.taxonomy !== this.props.taxonomy ) {
			this.setState( { search: '' } );
		}
	}

	render() {
		const {
			className,
			taxonomy,
			onChange,
			selected,
			createLink,
			multiple,
			height,
			compact,
			addTerm,
			postType,
			onAddTermSuccess,
		} = this.props;

		const classes = classNames( className );
		const { search } = this.state;
		const query = {};
		if ( search && search.length ) {
			query.search = search;
		}

		return (
			<div className={ classes } ref="wrapper">
				<TermTreeSelectorTerms
					taxonomy={ taxonomy }
					onSearch={ this.onSearch }
					onChange={ onChange }
					query={ query }
					selected={ selected }
					createLink={ createLink }
					multiple={ multiple }
					height={ height }
					compact={ compact }
				/>
				{ addTerm && (
					<TermSelectorAddTerm
						taxonomy={ taxonomy }
						postType={ postType }
						onSuccess={ onAddTermSuccess }
					/>
				) }
			</div>
		);
	}
}
