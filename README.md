# 🗺️ AI Trip Planner

An intelligent, AI-powered trip planning application that creates personalized travel itineraries through conversational AI interactions.

## Project Info

**Features:**
- 🤖 Conversational AI Trip Planning - Chat with an AI assistant that guides you through planning your perfect trip
- 🏨 Hotel Recommendations - AI-curated hotel suggestions with pricing, ratings, and locations
- 📍 Day-by-Day Itineraries - Detailed daily plans with activities, ticket pricing, and best times to visit
- 🔐 User Authentication - Secure sign-in with Clerk
- 💾 Trip Persistence - Save your trip plans with Convex real-time database

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd trip-planner-app

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (create .env.local file)
# OPENROUTER_API_KEY=your_openrouter_api_key
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
# CLERK_SECRET_KEY=your_clerk_secret
# CONVEX_DEPLOYMENT=your_convex_deployment
# NEXT_PUBLIC_CONVEX_URL=your_convex_url
# GOOGLE_PLACES_API_KEY=your_google_api_key
# ARCJET_KEY=your_arcjet_key

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Next.js 15 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- Clerk (Authentication)
- Convex (Real-time Database)
- OpenRouter API (AI/LLM)
- Arcjet (API Security)
- Google Places API
- Radix UI Components
- Motion (Animations)

## How can I deploy this project?

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
