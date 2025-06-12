const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");

const router = express.Router();

// Function to fetch and parse articles from MedlinePlus
const fetchArticles = async (query) => {
  const API_URL = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(API_URL);

    return new Promise((resolve, reject) => {
      xml2js.parseString(response.data, (err, result) => {
        if (err) {
          console.error("❌ XML Parsing Error:", err);
          return reject("Error parsing XML");
        }

        // Validate API response structure
        if (
          !result?.nlmSearchResult?.list?.[0]?.document
        ) {
          console.error("❌ Unexpected API response structure:", JSON.stringify(result, null, 2));
          return reject("Unexpected API response structure");
        }

        const documents = result.nlmSearchResult.list[0].document;

        if (!documents || documents.length === 0) {
          console.warn("⚠ No articles found for query:", query);
          return resolve([]); // Return an empty array if no results
        }

        // Extract relevant article data
        const articles = documents.map((doc) => {
          const titleContent = doc.content?.find((c) => c.$.name === "title")?._ || "No Title";
          const cleanedTitle = titleContent.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
          const articleUrl = doc.$?.url || "#"; // Use URL if available, otherwise default to "#"

          return { title: cleanedTitle, url: articleUrl };
        });

        console.log("✅ Extracted Articles:", articles);
        resolve(articles);
      });
    });
  } catch (error) {
    console.error("❌ Error fetching articles:", error.message);
    throw new Error("Failed to fetch articles");
  }
};

// API Route to fetch articles based on query (default to "women's health")
router.get("/", async (req, res) => {
  const query = req.query.topic || "women's health"; // Allow dynamic search terms

  try {
    const articles = await fetchArticles(query);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
