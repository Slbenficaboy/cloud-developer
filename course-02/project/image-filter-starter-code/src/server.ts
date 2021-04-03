import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  app.get( "/filteredimage", async ( req, res ) => {
    
    // Extract the image_url from query parameters
    var image_url = req.query.image_url;

    // Verify an image_url was provided. If not, return an error
    if (image_url == undefined) {
      res.status(400).send("{image_url} required");
    } else {
      console.log("Filter: " + req.query.image_url);
            
      var filterd_image = await filterImageFromURL(image_url);
      console.log("Filtered image: " + filterd_image);

      filterd_image = filterd_image + "testing";
      
      res.status(200).sendFile(filterd_image, function (err) {
        if (err) {
          console.log("Error returning filtered image");
          res.status(404).send("Filtered image not found");
        } else {
          console.log("Filtered image retunred succesfully");
        }
      });      
    }
  } );
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();