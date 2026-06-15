# Book Vault (Supabase Edition)

A personal reading tracker and second brain app built with React, Vite, Tailwind CSS, and Supabase.

## Features

- **Book Tracking**: Add books, track reading progress, update statuses (Want to read, Reading, Finished, Abandoned).
- **Quotes**: Save and organize quotes from books you've read.
- **Stats & Insights**: View detailed statistics about books read, total pages, average rating, favorite author, and monthly reading trends.
- **Reading Wrapped**: A visual recap of your reading year.
- **Export/Import**: Keep your data safe by exporting and importing it as a JSON file.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
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
