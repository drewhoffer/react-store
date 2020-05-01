import { Input } from 'semantic-ui-react';
import React from 'react';
import Router, { useRouter } from 'next/router';
import baseUrl from '../../utils/baseUrl';
import cookie from 'js-cookie';
import axios from 'axios';
import catchErrors from '../../utils/catchErrors';

function AddProductToCart({ user , productId}) {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [quantity, setQuantity] = React.useState(1);
  const router = useRouter();


  React.useEffect(() => {
    //will prevent error of user leaving and the component no longer being mounted
    let timeout;

    if (success){
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [success] );


  async function AddProductToCart({user}){
    setLoading(true);
    try{      
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId};
      const token = cookie.get('token');
      const headers = { headers: {Authorization: token }}; 
      await axios.put(url,payload, headers);
      setSuccess(true);
    }catch( error ) {
      
      catchErrors(error, window.alert);
    }finally{
      setLoading(false);
    }
  }



  return <Input
    type="number"
    min="1"
    placeholder="Quantity"
    value={quantity}
    onChange={event => {setQuantity(Number(event.target.value))}}
    action={user && success ? {
      color: "blue",
      content: "Item Added!",
      icon: "plus cart",
      disabled: true
    } : 
    user ? {
      color: "orange",
      content: "Add to Cart",
      icon: "plus cart",
      loading,
      disabled: loading,
      onClick: AddProductToCart

    } : {
      color: "blue",
      content: "Sign up to purchase",
      icon: "signup",
      onClick: () => router.push('/signup')
    }
  }
  />;
}

export default AddProductToCart;
  