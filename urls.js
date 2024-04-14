const fs = require("fs");
const axios = require("axios");
const { URL } = require("url");

// Function to download HTML content from a URL and save it to a file
async function downloadHTML(url, filename) {
  try {
    const response = await axios.get(url);
    await fs.promises.writeFile(filename, response.data);
    console.log(`Wrote to ${filename}`);
  } catch (error) {
    console.error(`Error downloading ${url}: ${error.message}`);
  }
}

// Main function to process URLs from the input file
async function processURLs(filename) {
  try {
    const urls = fs.readFileSync(filename, "utf8").split("\n").filter(Boolean);

    for (const url of urls) {
      try {
        const { hostname } = new URL(url);
        const outputFilename = `${hostname}.txt`;
        await downloadHTML(url, outputFilename);
      } catch (error) {
        console.error(`Error processing ${url}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filename}: ${error.message}`);
    process.exit(1); // End the script with an error
  }
}

// Check if the script is executed from the command line
if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error("Usage: node urls.js FILENAME");
    process.exit(1); // End the script with an error
  }

  const filename = process.argv[2];
  processURLs(filename);
}

module.exports = { processURLs }; // Export for testing
