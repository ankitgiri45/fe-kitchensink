# FE-Kitchen Sink Application

## Features

- User Authentication
- Role-based Authorization
- User Management
- Material UI Components
- Responsive Design
- Type-safe Development with TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.x or higher)
- npm (version 8.x or higher) or yarn
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ankitgiri45/fe-kitchensink.git
cd fe-kitchensink
```

### 2. Install Dependencies

```bash
npm install
# or if you use yarn
yarn
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_api_base_url
```

### 4. Running the Application

#### Development Mode

To start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

#### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

- `/src` - Source code directory
  - `/api` - API configuration and service files
  - `/assets` - Static assets
  - `/common` - Reusable components
  - `/constant` - Constants and endpoints
  - `/model` - TypeScript interfaces and types
  - `/pages` - Page components
  - `/store` - Redux store configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
