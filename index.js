const express = require("express");
const axios = require("axios");
const app = express();

// We'll read your restricted key from an env var:
const KEY = process.env.GOOGLE_ROUTES_API_KEY;
const URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

app.use(express.json());

app.post("/routes", async (req, res) => {
  try {
    const fieldMask = req.headers["x-goog-fieldmask"];
    const googleRes = await axios.post(`${URL}?key=${KEY}`, req.body, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": fieldMask, // Forward the header
      },
    });
    res.json(googleRes.data);
  } catch (e) {
    console.error("Proxy error:", e.response?.data || e.message);
    res.status(e.response?.status || 500).json({
      error: e.response?.data?.error || e.message,
    });
  }
});

// Listen on the port Render gives us, or 3000 locally:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy listening on port ${PORT}`));
