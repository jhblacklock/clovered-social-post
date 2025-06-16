# Clovered Social Post Generator

A Next.js application for generating and managing social media posts across multiple platforms.

## Features

- Multi-platform post generation (Instagram, LinkedIn, X, Facebook)
- AI-powered content optimization
- Image generation and customization
- Platform-specific formatting
- Export to CSV
- Buffer integration

## Tech Stack

- Next.js 15.3.3
- TypeScript
- Tailwind CSS
- n8n for workflow automation
- OpenAI for content and image generation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/wtblacklock/clovered-social-post.git
cd clovered-social-post
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── blog-input/   # Blog content input
│   ├── image-prompt/ # Image generation
│   ├── platform-post/# Platform-specific posts
│   └── ui/          # Shared UI components
├── lib/             # Utilities and configuration
└── types/           # TypeScript type definitions
```

## Configuration

The application uses a brand configuration file (`src/lib/brand-config.ts`) that defines:
- Platform-specific settings
- Image generation parameters
- Content generation rules
- Brand styling

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
