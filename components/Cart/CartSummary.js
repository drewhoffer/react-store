import {Button, Segment, Divider} from 'semantic-ui-react';
import React from 'react';
import calculateCartTotal from '../../utils/calculateCartTotal';
import StripeCheckout from 'react-stripe-checkout';


function CartSummary({ products, handleCheckout, success } ) {
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0)
  }, [products])

  return (
  <>
  <Divider/>

  <Segment clearing size="large">
    <strong>Sub total:</strong> ${cartAmount}
    <StripeCheckout
      name="Ikea-Clone"
      amount={stripeAmount}
      image={products.length > 0 ? products[0].product.mediaUrl : ""}
      currency="USD"
      shippingAddress={true}
      billingAddress={true}
      zipCode={true}
      stripeKey="pk_test_8ZRcssgkJNo6tAzwZw0AVdsq00F6JmjUfE"
      token={handleCheckout}
      triggerEvent="onClick">
    <Button
        color="teal"
        icon="cart"
        disabled={isCartEmpty || success}
        content="Checkout"
        floated="right"
      />
    </StripeCheckout>

  </Segment>
  </>
  );
}

export default CartSummary;
