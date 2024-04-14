const express = require("express");
const axios = require("axios");

var app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.post("/", async (req, res, next) => {
  try {
    const { developers } = req.body; // Extract developers array from request body
    const results = await Promise.all(
      developers.map(async (d) => {
        const response = await axios.get(`https://api.github.com/users/${d}`);
        return response.data; // Return only the data object from the response
      })
    );
    const out = results.map((r) => ({ name: r.name, bio: r.bio }));

    return res.json(out); // Send the response as JSON
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

app.use((err, req, res, next) => {
  console.error(err); // Log the error
  res.status(500).send("Something went wrong"); // Send a generic error response
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
