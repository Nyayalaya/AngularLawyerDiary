import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    middlewareMode: false,
    headers: {
      'Cache-Control': 'no-cache',
    },
    // Increase header size limits to fix 431 error
    httpd: {
      maxHeaderSize: 16 * 1024, // 16KB (default is 8KB)
    },
  },
});
