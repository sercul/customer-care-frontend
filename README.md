# Gominga Frontend

A modern review management system built with Next.js 14, Apollo Client, and TailwindCSS.

## Features

- Modern, responsive UI built with TailwindCSS
- Real-time review management
- AI-powered review analytics
- Customer care integration
- Authentication and authorization
- GraphQL API integration

## Tech Stack

- Next.js 14
- Apollo Client
- TailwindCSS
- TypeScript
- React Hook Form
- HeadlessUI

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/gominga-frontend.git
cd gominga-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Your GraphQL API endpoint
- `NEXT_PUBLIC_JWT_COOKIE_NAME`: Cookie name for JWT token storage

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Run linter
npm run lint
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy!

## Project Structure

```
src/
├── app/                 # Next.js 14 app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
