// Angular dev server configuration to increase header limits
// This configures Node.js HTTP server to handle larger headers (fixes 431 error)
module.exports = {
  server: {
    middlewareMode: false,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  },
  // Custom middleware to increase header size limits
  plugins: [
    {
      name: 'configure-server',
      configResolved(config) {
        // Node.js HTTP server options
        process.env.NODE_OPTIONS = '--max-http-header-size=16384';
      },
    },
  ],
};
