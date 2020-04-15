import { Form, Input, TextArea, Button, Image, Message,
   Header, Icon, } from 'semantic-ui-react';
import React from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors.js';


const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
}
function CreateProduct() {
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [success, setSuccess] = React.useState(false);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  
  //Prevents invalid form submission by ensuring fields are not empty
  React.useEffect( () => {
   const isProduct = Object.values(product).every(el => Boolean(el))
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product])



function handleChange(event) {
  const {name, value, files } = event.target;

  if (name === 'media' ) {
    //handle if user didnt select image
    if (files[0] != null)
    {
      setProduct( prevState => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    }
    //if they hit cancel we can just set media back to nothing which will display our blank image
    else{
      setProduct( prevState => ({ ...prevState, media: "" }));
    }

  }
  else {
    //keeps a product all together and updates correct value
    //updater pattern
    setProduct( prevState => ({...prevState, [name]: value })); 
    // set correct value of correct type to new value
  }
  
}


async function handleImageUpload() {
  const data = new FormData();
  data.append('file', product.media);
  data.append('upload_preset', 'ikea-clone');
  data.append('cloud_name','drewhoff');
  const response = await axios.post(process.env.CLOUDINARY_URL, data);
  const mediaUrl = response.data.url;
  return mediaUrl;

}



async function handleSubmit(event) {

  setLoading(true);

  try{
    setError("");
    event.preventDefault();
    const mediaUrl = await handleImageUpload();
    const url = `${baseUrl}/api/product`;
    const {name, price, description } = product;
    const payload = { name, price, description, mediaUrl};
    const reponse = await axios.post(url, payload);
    setProduct(INITIAL_PRODUCT);
    setSuccess(true);
  }catch(error) {
    catchErrors(error, setError);
  }finally {
    setLoading(false);
  }

}


  return (
    <>
    <Header as="h2" block>
      <Icon name="add" color="orange"/>
      Create New Product
    </Header>
    <Form loading={loading} error={Boolean(error)} success = {success} onSubmit={handleSubmit}>
      <Message
        error
        header="Oops!"
        content= {error}
      />
      <Message
        success
        icon="check"
        header="Success!"
        content="Your product has been posted"
      />
      <Form.Group widths="equal">
        <Form.Field
          control={Input}
          name="name"
          label="Name"
          placeholder="Name"
          value={product.name}
          type="text"
          onChange={handleChange}
        />
        <Form.Field
          control={Input}
          name="price"
          label="Price"
          placeholder="Price"
          value={product.price}
          type="number"
          min="0.00"
          step="0.01"
          onChange={handleChange}

        />
        <Form.Field
          control={Input}
          name="media"
          label="Media"
          content="Select Image"
          accept="image/*"
          type="file"
          onChange={handleChange}
        />
      </Form.Group>



      {product.media === "" ? ( // if the image is empty place our no image placeholder there else show the media
        <Image src={"../static/no-image.png"} 
          rounded centered size="small" bordered               
          style={{marginBottom: '1em'}}
        />
      ): (
        <Image src={mediaPreview} rounded centered size="small" bordered
          style={{marginBottom: '1em'}}
        />
      )}



      <Form.Field
        control={TextArea}
        name="description"
        lable="Description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}

        />
        <Form.Field
          control={Button}
          disabled={loading || disabled}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
          />
    </Form>
    </>
  );
}

export default CreateProduct;
