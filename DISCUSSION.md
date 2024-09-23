Here are key features on which I worked to improve this webpage.
1. First of all, I had changed that all data was searched on the server side.
   In the original codebase, every search logic was placed on the client side, so we had to get all the data from the database to the frontend.
   It could be efficient in a small database but not good for a large database with hundreds of thousands of records.
2. And second, I had added pagination.
   As you are aware, the database does not allow us to retrieve all hundreds of thousands of records, and the server is burdened with a laborious task that loads slowly.
   In order to only retrieve data that users will see, I added a pagination feature, which also affects the search page.
3. And third, fix some styles using Joy UI that based on Material UI.