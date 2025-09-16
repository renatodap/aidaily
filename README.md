# AI Daily Dashboard

A Next.js content creation dashboard for managing AI-generated news topics with personal commentary. Built for CS students and content creators who want to efficiently review AI news, add personal insights, and prepare content for multiple platforms.

## Features

### Core Functionality
- **Real-time Dashboard**: Split view showing pending and approved topics
- **Commentary Editor**: Rich text editor with 500+ word minimum enforcement
- **Platform Previews**: See how content looks on Instagram, Twitter, and YouTube
- **Auto-save**: Drafts save every 30 seconds automatically
- **Keyboard Shortcuts**: Cmd+S to save, Cmd+Enter to approve

### Topic Management
- **Smart Filtering**: Filter by momentum (breaking, peaking, critical, emerging)
- **Search**: Full-text search across titles and summaries
- **Status Tracking**: Pending, Approved, and Archived states
- **Batch Export**: Export topics to CSV for bulk planning

### Analytics
- **Dashboard Stats**: Track approval rates, review times, momentum distribution
- **Performance Metrics**: Monitor technical depth and viral potential averages
- **Platform Tracking**: See which platforms each topic has been posted to

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Shadcn/ui
- **Rich Text**: TipTap Editor
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/renatodap/aidaily.git
cd aidaily
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase
- Create a new Supabase project
- Run the schema SQL from `supabase/schema.sql`
- Copy your project URL and keys

4. Configure environment variables
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
N8N_WEBHOOK_SECRET=your_webhook_secret
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Database Schema

### Topics Table
- `id`: UUID primary key
- `title`: Topic title
- `summary`: Brief summary
- `relevance`: Why this matters
- `content_hook`: Engaging hook for content
- `momentum`: breaking | peaking | critical | emerging
- `technical_depth`: 1-5 rating
- `viral_potential`: 1-5 rating
- `status`: pending | approved | archived
- `my_commentary`: Personal insights (500+ words)
- `platform_suggestions`: JSON with platform-specific ideas
- `hashtags`: Array of relevant hashtags

### Topic Metrics Table
- `id`: UUID primary key
- `topic_id`: Foreign key to topics
- `platform`: instagram | twitter | youtube
- `posted_at`: Timestamp
- `engagement_score`: Performance metric

## Usage

### Review Workflow

1. **Pending Topics**: New topics appear in the pending tab
2. **Add Commentary**: Click a topic to open the review modal
3. **Write Insights**: Add 500+ words of personal commentary
4. **Platform Preview**: Check how content looks on each platform
5. **Approve**: Click "Approve & Move" when ready

### Keyboard Shortcuts

- `Cmd/Ctrl + S`: Save draft
- `Cmd/Ctrl + Enter`: Approve topic (if 500+ words)
- `Esc`: Close modal

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Environment Variables for Production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `N8N_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Features Roadmap

- [ ] Direct posting to social platforms
- [ ] AI-powered hashtag suggestions
- [ ] Collaborative review mode
- [ ] Advanced analytics dashboard
- [ ] Content scheduling
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please use the GitHub issues page
