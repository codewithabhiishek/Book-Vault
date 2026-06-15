# Book Vault

A personal reading tracker and second brain app built with React, Vite, Tailwind CSS, and Firebase. This application features a stunning neo-brutalist aesthetic with custom typography and tactile animations.

## Features

- **Book Tracking**: Add books, track reading progress, update statuses (Want to read, Reading, Finished, Abandoned).
- **Quotes**: Save and organize quotes from books you've read.
- **Data Export Images**: Generate and download shareable, brutalist-style images of your favorite quotes.
- **Stats & Insights**: View detailed statistics about books read, total pages, average rating, favorite author, and monthly reading trends.
- **Reading Wrapped**: A visual recap of your reading year.
- **Export/Import**: Keep your data safe by exporting and importing it as a JSON file.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and configure your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Development

Run the development server locally:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
