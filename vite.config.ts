import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-diagram-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/save') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const dir = path.resolve(__dirname, 'diagrams');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const safeName = (data.name || 'diagram').replace(/[:/\\?%*|"<>]/g, '-');
                const filename = `${safeName}-${timestamp}.json`;
                const filePath = path.join(dir, filename);
                
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, path: filePath, filename }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});