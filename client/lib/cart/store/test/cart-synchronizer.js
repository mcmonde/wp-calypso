/** @format */

/**
 * External dependencies
 */
import assert from 'assert'; // eslint-disable-line import/no-nodejs-modules

/**
 * Internal dependencies
 */
import CartSynchronizer from '../cart-synchronizer';
import FakeWPCOM from './fake-wpcom';

var TEST_CART_KEY = 91234567890;

var poller = {
	add: function() {},
};

describe( 'cart-synchronizer', () => {
	let applyCoupon, applyInstallments, emptyCart;

	beforeAll( () => {
		const cartValues = require( 'lib/cart-values' );

		applyCoupon = cartValues.applyCoupon;
		applyInstallments = cartValues.applyInstallments;
		emptyCart = cartValues.emptyCart;
	} );

	describe( '*before* the first fetch from the server', () => {
		test( 'should *not* allow the value to be read', () => {
			var wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller );

			assert.throws( () => {
				synchronizer.getLatestValue();
			}, Error );
		} );

		test( 'should enqueue local changes and POST them after fetching', () => {
			var wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
				serverCart = emptyCart( TEST_CART_KEY );

			synchronizer.fetch();
			synchronizer.update( applyCoupon( 'foo' ) );
			synchronizer.update( applyInstallments( 3 ) );

			assert.throws( () => {
				synchronizer.getLatestValue();
			}, Error );
			wpcom.resolveRequest( 0, serverCart );

			assert.equal( synchronizer.getLatestValue().coupon, 'foo' );
			assert.equal( wpcom.getRequest( 1 ).method, 'POST' );
			assert.equal( wpcom.getRequest( 1 ).cart.coupon, 'foo' );
			assert.equal( wpcom.getRequest( 1 ).cart.installments, 3 );

			wpcom.resolveRequest( 1, applyCoupon( 'bar' )( serverCart ) );
			assert.equal( synchronizer.getLatestValue().coupon, 'bar' );

			wpcom.resolveRequest( 1, applyInstallments( 10 )( serverCart ) );
			assert.equal( synchronizer.getLatestValue().installments, 10 );
		} );
	} );

	describe( '*after* the first fetch from the server', () => {
		test( 'should allow the value to be read', () => {
			var wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
				serverCart = emptyCart( TEST_CART_KEY );

			synchronizer.fetch();
			wpcom.resolveRequest( 0, serverCart );

			assert.equal( synchronizer.getLatestValue().blog_id, serverCart.blog_id );
		} );
	} );

	test( 'should make local changes visible immediately', () => {
		var wpcom = FakeWPCOM(),
			synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
			serverCart = emptyCart( TEST_CART_KEY );

		synchronizer.fetch();
		wpcom.resolveRequest( 0, serverCart );

		synchronizer.update( applyCoupon( 'foo' ) );
		assert.equal( synchronizer.getLatestValue().coupon, 'foo' );
	} );
} );
