
# Project Description


This project aims to develop a web application tailored for IT companies and beyond, providing an intuitive and efficient solution for task management and execution within the organization. The application offers a range of features that enhance project coordination and facilitate efficient task handling.

## Features
- **Graphical Project Management**: The application allows for easy graphical management of projects, enabling teams to visualize and organize tasks efficiently.


- **Agile Task Board**: Tasks can be managed on an agile task board, providing a flexible and collaborative environment for teams to track and prioritize their work.


- **Time Tracking**: Each task includes time tracking functionality, allowing users to monitor and analyze the time taken for task completion, facilitating performance evaluation and resource management.


- **Internal Knowledge Base and Issue Tracking**: The application incorporates an internal knowledge base and issue tracking system. It enables users to publish and search for internal problems and knowledge, fostering knowledge sharing and efficient problem resolution.


- **AI-Powered Problem KnowledgeBaseSearch**: Leveraging artificial intelligence (ChatGPT), the application offers intelligent problem search capabilities tailored to the company's knowledge base. This feature enables employees to swiftly find solutions to recurring issues and exchange insights and opinions.
Calendar Integration: The application includes a calendar function to plan and manage project timelines, events, meetings, and deadlines. The centralized calendar serves as a hub for tracking key project milestones and important organizational events.


## Customization and Branding
The application is highly customizable, allowing each company to tailor it to their specific needs and branding requirements. Customization options include the ability to personalize the application's name, logo, colors, and other visual elements.

## Benefits
By leveraging the comprehensive features provided by this application, companies can enhance task management, streamline project coordination, and foster effective communication among team members. The result is improved productivity, accelerated progress, and ultimately, better business outcomes.


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
```

## Run the development server

```bash
# install dependencies
npm install

# run the development server on ios
npm run dev:ios

# run the development server on windows
npm run dev:windows
```

## Prisma

```bash
# generates assets like Prisma Client based on the generator and data model blocks defined in your prisma/schema.prisma file.
npx prisma generate
```
```bash
# create a new migration
npx prisma migrate dev --name init
```
```bash
# seed the database
npx prisma db seed 
```

```bash
# push prisma schema to db without migration
npx prisma push 
```
```bash
 # connect to your database and add Prisma models to your Prisma schema
 npx prisma pull
```


```bash
# open prisma studio to view the database
npx prisma studio
```

## PlanetScale
You need to have the PlanetScale CLI installed and configured. You can find the instructions [here](https://planetscale.com/docs/reference/planetscale-cli).

```bash
# runs PlanetScale db locally
$ pscale connect companyhub_db
```