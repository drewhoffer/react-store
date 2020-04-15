function catchErrors (error, displayError) {
    let errorMessage;
    if (error.response) {
        //the request was made and server responded with a 
        //status code not in range of 2XX
        errorMessage = error.response.data;
        console.error("Error response", errorMessage);

        //for cloudinary image uploads
        if (error.response.data.error) {
            errorMessage =  error.response.data.error.message;
        }
    }
    else if (error.request){
        //reqquest was made with no response
        errorMessage = error.request;
        console.error("Error request", errorMessage);
    }
    else {
        console.error(error.message);
    }
    displayError(errorMessage);
}


export default catchErrors;