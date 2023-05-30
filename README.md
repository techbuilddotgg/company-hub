
# Project Description


This project aims to develop a web application tailored for IT companies and beyond, providing an intuitive and efficient solution for task management and execution within the organization. The application offers a range of features that enhance project coordination and facilitate efficient task handling.

## Features
- **Graphical Project Management**: The application allows for easy graphical management of projects, enabling teams to visualize and organize tasks efficiently.


- **Agile Task Board**: Tasks can be managed on an agile task board, providing a flexible and collaborative environment for teams to track and prioritize their work.


- **Internal Knowledge Base**: The application incorporates an internal knowledge base. It enables users to publish and search for internal problems and knowledge, fostering knowledge sharing and efficient problem resolution.


- **AI-Powered Problem KnowledgeBaseSearch**: Leveraging artificial intelligence (ChatGPT), the application offers intelligent problem search capabilities tailored to the company's knowledge base. This feature enables employees to swiftly find solutions to recurring issues and exchange insights and opinions.


- **Calendar Integration**: The application includes a calendar function to plan and manage project timelines, events, meetings, and deadlines.



## Technologies

This project leverages the following technologies:

- **Next.js**: A powerful React framework for building modern web applications.
- **Typescript**: A typed superset of JavaScript that enhances code readability and maintainability.
- **tRPC**: A lightweight and fast TypeScript RPC (Remote Procedure Call) framework for building APIs.
- **Prisma**: A modern database toolkit that simplifies database access and management.
- **PlanetScale MySql**: A cloud-native, scalable, and highly available MySQL-compatible database solution.
- **TailwindCSS**: A utility-first CSS framework that enables rapid UI development with pre-built and customizable components.
- **Clerk Auth**: A user authentication and authorization platform that simplifies secure user management.

These technologies have been carefully chosen to ensure efficient development, maintainable codebase, robust APIs, scalable databases, and a responsive and visually appealing user interface.


# Getting Started


## Environment Variables

```bash
# .env
NODE_ENV="development"
DATABASE_URL="mysql://root:password@localhost:3306/companyhub_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="test"
CLERK_SECRET_KEY="test"
OPENAI_API_KEY=sk-"test"
PINECONE_ENVIRONMENT="us-central1-gcp"
PINECONE_API_KEY="test"
PINECONE_INDEX="companyhub"
UPSTASH_REDIS_REST_URL="https://test.upstash.io"
UPSTASH_REDIS_REST_TOKEN="test"
PUSHER_APP_ID=12354
PUSHER_KEY="test"
PUSHER_SECRET=2132
PUSHER_CLUSTER="eu"
NEXT_PUBLIC_PUSHER_APP_KEY="test"
NEXT_PUBLIC_PUSHER_APP_CLUSTER="eu"
GITHUB_WEBHOOK_SECRET="test"
GITHUB_WEBHOOK_LISTENER_URL="https://companyhub/api/github "

```

## Run the development server

```bash
# install dependencies
npm install

# run the development server
npm run dev

# run tests
npm run test:unit
```

## Prisma

```bash
# open prisma studio to view the database in a graphical user interface
npx prisma studio
```

## PlanetScale
You need to have the PlanetScale CLI installed and configured. You can find the instructions [here](https://planetscale.com/docs/reference/planetscale-cli).

```bash
# runs PlanetScale db locally
$ pscale connect companyhub_db
```