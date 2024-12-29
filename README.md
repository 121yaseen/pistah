# Pistah

Pistah is a platform designed to list all digital billboards and enable ad providers (ad agencies, businesses, individuals, etc.) to push their ads directly to billboards with ease, eliminating delays and operational hassle.

## Features

- **Billboard Management:** Easily list and manage digital billboards with all relevant details.
- **Ad Booking:** Allow businesses to book and upload advertisements with real-time scheduling.
- **Seamless Integration:** Ad providers can directly interact with billboard owners through the platform.
- **Date Range Selection:** Advanced date pickers for precise ad scheduling.
- **Dark Mode Support:** User-friendly interface with light and dark mode options.
- **Responsive Design:** Optimized for all devices.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org) for server-rendered React applications.
- **Backend:** Node.js with Prisma ORM and MongoDB for data persistence.
- **UI Framework:** Tailwind CSS for fast and responsive design.
- **Image Optimization:** Integrated with Next.js `next/image`.
- **Database:** MongoDB.
- **Deployment:** Vercel (for hosting).

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org) (v16 or higher)
- [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com)
- MongoDB instance running locally or remotely
- [Prisma CLI](https://www.prisma.io/docs/getting-started/quickstart) for managing the database schema

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/pistah-ad/pistah-ssp.git
cd pistah
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a .env file in the root directory and add the following variables:

```bash
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/pistah?retryWrites=true&w=majority
```

Replace `<`username`>`, `<`password`>`, and `<`cluster-url`>` with your MongoDB credentials and URL.

### 4. Run Development Server

``` bash
npm run dev
# or
yarn dev
```

Open <http://localhost:3000> with your browser to see the result.

## Database Setup

### 1. Initialize the Database

Run Prisma migrations to set up the MongoDB schema:

```bash
npx prisma db push
```

### 2. Seed the Database

Add initial data to the database:

```bash
npm run seed
```

## Folder Structure

```bash
├── public               # Static assets (images, etc.)
├── src
│   ├── app
│   │   ├── components   # Reusable UI components
│   │   ├── services     # Service layer (API integrations)
│   │   ├── pages        # Application pages
│   │   └── types        # TypeScript interfaces
│   ├── database         # Database schema and seed files
│   ├── repositories     # Database interaction layer
│   └── utils            # Utility functions
├── prisma               # Prisma schema and migrations
├── .env                 # Environment variables
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── README.md            # Project documentation
```

## Deployment

The easiest way to deploy this application is with Vercel.

#### 1. Push your code to GitHub

#### 2. Connect your repository to Vercel

#### 3. Add the environment variables in the Vercel dashboard

#### 4. Deploy your application
