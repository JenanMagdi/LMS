// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';

// // https://vitejs.dev/config/
// export default defineConfig({

//   plugins: [react()],
//   optimizeDeps: {
//     include: ['firebase'],
    
//   },



// })



// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
  },
  server: {
    proxy: {
      '/api': 'https://lmsystem-27bd8.firebaseapp.com',
    },
  },
});

