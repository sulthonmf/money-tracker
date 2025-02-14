# Expense Tracker App

A mobile app built with Expo and React Native for tracking personal income and expenses.

## Features

- Track income and expenses
- View financial statistics and charts
- Filter transactions by time period
- Real-time balance updates
- Secure authentication

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (for backend)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server
```bash
npx expo start
```

## Running the App

- iOS: Press `i` in terminal or use iOS Simulator
- Android: Press `a` in terminal or use Android Emulator
- Web: Press `w` in terminal

## Tech Stack

- React Native
- Expo
- Redux Toolkit
- React Native Paper
- Supabase
- TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
