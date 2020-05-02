import Stripe from 'stripe';
import uuidv4 from 'uuid/v4'; //random string
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import calculateCartTotal from '../../utils/calculateCartTotal';
import Order from '../../models/Order';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export default async (req, res) => {
    const { paymentData } = req.body;
    try{
      //1) verify and get token from user
      const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);


      //2)find their cart
      const cart = await Cart.findOne({user: userId}).populate({
          path: "products.product",
          model: "Product"
      });

      //3)calculate cart totals again (safer due to doing server side validation)
      const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);


    //4) get email for payment data, see if email linked with existing stripe customer
      const previousCustomer = await stripe.customers.list( {
        email: paymentData.email,
        limit: 1
      });



    //5) if not existing , create them based on email
      const isExistingCustomer = previousCustomer.data.length > 0;
      let newCustomer;  
      if (!isExistingCustomer){
        newCustomer= await stripe.customers.create({
            email: paymentData.email,
            source: paymentData.id
        });
      }
      const customer = (isExistingCustomer && previousCustomer.data[0].id) || newCustomer.id;



      //6 Create a charge with total, send receipt email
      const charge = await stripe.charges.create({
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`
      }, {
        idempotency_key: uuidv4()
      });


      //7) add order data
      await new Order({
        user: userId,
        email: paymentData.email,
        total: cartTotal,
        products: cart.products
      }).save();
    //8) clear products in cart
      await Cart.findOneAndUpdate(
        {_id: cart._id},
        {$set: {products: []}}
      )
    //send back success
      res.status(200).send("Checkout successful")


    }catch( error ){
      console.error(error);
      res.status(500).send("Error processing charge");
    }
}