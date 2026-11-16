// Global error handler (must be registered last).
// Honors the status of known client errors (e.g. 413 "payload too large" or
// 400 "malformed JSON" from body-parser) instead of masking them as 500s, and
// never leaks internal error details to the client.
module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const messages = {
    400: "Bad request",
    413: "Request body is too large",
  };
  return res.status(status).json({ error: messages[status] || "Request could not be processed" });
};
