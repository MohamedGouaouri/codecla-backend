
## File upload Supabase
In this assignment, you are going to implement profile update with file upload functionality in express app backend and React with Supabase backend-as-a-service.


### 1. Supabase setup

- Before you start make sure to create a new project in supabase.
- Create a **public** bucket named `avatars`. The bucket should be public to allows anyone with image url to access since we are not using supabase authentication service in our backend.
- Make sure to install [supabase](https://www.npmjs.com/package/@supabase/supabase-js) javascript client in your express application.
- Copy the project url and the api key and put them as environment variables in your express app.
- Install [multer](https://www.npmjs.com/package/multer) library. Multer is a nodejs middleware used to handle multipart/form-data, the data transfer format for file upload.

### 2. Profile update
- Create a route in coder profile management module in your express application that allows the coder to **update** his profile.
The coder can update his `avatar`, `first_name`, `last_name` and `about` fields.
- Create an upload middleware using Multer. Configure it to use in-memory storage, which is suitable for handling file uploads without saving them to disk immediately, and add it the previous route.

You can make use of this code snippet for the in-memory storage middleware:
```js
export const uploadMiddleware = multer({
    storage: multer.memoryStorage()
})
```
- Create the controller for that route.
- Develop a utility function responsible for uploading the file object (accessible via request.file) to the Supabase avatars bucket. Ensure that this function retrieves the public URL of the uploaded image upon successful upload.
- Create the service called by the controller and pass the request data to it along with the file object
- The service should invoke the upload function and get the public url.
- The service should update the coder's profile information based on the received data. If the public URL is not empty, update the avatar field. Also, update the first_name, last_name, and about fields if they are present in the request data.

>Note: Upload file update, if you get row-level security issues, make sure to have the right policies applied to your bucket or **disable this security feature just for the sake of development**! using the following SQL query.
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY
```