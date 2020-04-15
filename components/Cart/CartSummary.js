import {Button, Segment, Divider} from 'semantic-ui-react';

function CartSummary() {
  return <>
  <Divider/>
  <Segment clearing size="large">
    <strong>Sub total:</strong> $0.00
    <Button
      color="teal"
      icon="cart"
      content="Checkout"
      floated="right"
    />
  </Segment>
  </>;
}

export default CartSummary;
