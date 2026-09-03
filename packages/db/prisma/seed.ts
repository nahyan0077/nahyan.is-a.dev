import 'dotenv-expand/config'
import 'dotenv/config'
import { createPrismaClient } from '@db'

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed must not run in production')
}

const prisma = createPrismaClient()

async function main() {
  // Tags
  const tags = await Promise.all(
    [
      { slug: 'react', label: 'React', color: '#61DAFB' },
      { slug: 'typescript', label: 'TypeScript', color: '#3178C6' },
      { slug: 'node', label: 'Node.js', color: '#339933' },
      { slug: 'postgres', label: 'PostgreSQL', color: '#4169E1' },
      { slug: 'nextjs', label: 'Next.js', color: '#000000' },
      { slug: 'tailwind', label: 'Tailwind CSS', color: '#06B6D4' },
      { slug: 'mongodb', label: 'MongoDB', color: '#47A248' },
      { slug: 'docker', label: 'Docker', color: '#2496ED' },
      { slug: 'kubernetes', label: 'Kubernetes', color: '#326CE5' },
      { slug: 'kafka', label: 'Apache Kafka', color: '#231F20' },
      { slug: 'webrtc', label: 'WebRTC', color: '#FF6600' },
      { slug: 'redis', label: 'Redis', color: '#DC382D' },
      { slug: 'aws', label: 'AWS', color: '#FF9900' },
      { slug: 'azure', label: 'Azure', color: '#0078D4' },
      { slug: 'python', label: 'Python', color: '#3776AB' },
      { slug: 'express', label: 'Express.js', color: '#000000' },
      { slug: 'redux', label: 'Redux', color: '#764ABC' },
    ].map((tag) =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      }),
    ),
  )

  console.log(`Seeded ${tags.length} tags`)

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.warn('SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set — skipping admin user')
  } else {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: { email: adminEmail, passwordHash },
    })

    console.log(`Seeded admin user: ${admin.email}`)

    // ──────────────────────────────────────────────────────────
    // Projects
    // ──────────────────────────────────────────────────────────

    // 1. EduVerse
    const eduverse = await prisma.project.upsert({
      where: { slug: 'eduverse' },
      update: {},
      create: {
        slug: 'eduverse',
        title: 'EduVerse',
        tagline: 'A full-scale e-learning platform built on microservices',
        shortDescription:
          'EduVerse is a production-grade e-learning platform connecting learners and instructors through live video, real-time chat, and structured courses — all running on a Kafka-backed microservices architecture deployed to Azure Kubernetes Service.',
        descriptionMd: `## EduVerse

A full-scale e-learning platform built from scratch with a microservices architecture. Instructors can create and publish courses; learners can enrol, track progress, and communicate in real time via text chat and WebRTC-powered audio/video calls.

### Architecture

The system is split into independent services:
- **API Gateway** — single entry point, JWT auth, rate limiting
- **Auth Service** — user registration, OAuth, token management  
- **Course Service** — course CRUD, module management, enrolment
- **Chat Service** — real-time messaging via WebSocket
- **Notification Service** — push and email notifications via Kafka events
- **Payment Service** — paid course checkout flow

All services communicate asynchronously via **Apache Kafka**.

### Infrastructure

- Containerised with **Docker**, orchestrated via **Kubernetes on Azure (AKS)**
- CI/CD pipeline for automated deploys
- Clean Architecture throughout — domain, application, and infrastructure layers kept separate

### Frontend

Built in **React + Redux** with **Tailwind CSS**. Includes a full course player, real-time chat UI, and one-to-one WebRTC video/audio calling.`,
        role: 'Full-Stack Engineer',
        startedAt: new Date('2023-10-01'),
        endedAt: new Date('2024-03-01'),
        repoUrl: 'https://github.com/nahyan0077/eduverse-backend',
        featured: true,
        published: true,
        displayOrder: 1,
        projectTags: {
          create: [
            { tag: { connect: { slug: 'node' } } },
            { tag: { connect: { slug: 'react' } } },
            { tag: { connect: { slug: 'mongodb' } } },
            { tag: { connect: { slug: 'kafka' } } },
            { tag: { connect: { slug: 'docker' } } },
            { tag: { connect: { slug: 'kubernetes' } } },
            { tag: { connect: { slug: 'webrtc' } } },
            { tag: { connect: { slug: 'azure' } } },
            { tag: { connect: { slug: 'typescript' } } },
            { tag: { connect: { slug: 'redux' } } },
          ],
        },
      },
    })
    console.log(`Seeded project: ${eduverse.title}`)

    // 2. DropShip
    const dropship = await prisma.project.upsert({
      where: { slug: 'dropship' },
      update: {},
      create: {
        slug: 'dropship',
        title: 'DropShip',
        tagline: 'A production e-commerce platform deployed on AWS',
        shortDescription:
          'DropShip is a full-featured footwear e-commerce platform built with an MVC architecture and deployed to AWS EC2 — covering the full user journey from product browsing to order management.',
        descriptionMd: `## DropShip

A production-grade e-commerce platform for footwear, built with a clean MVC architecture and deployed to **AWS EC2**.

### Features

- Product catalogue with filtering and search
- User authentication and session management
- Shopping cart and checkout flow
- Order history and management
- Admin panel for product and inventory management

### Architecture

Follows a strict **MVC pattern** — controllers handle HTTP logic, services handle business rules, and models own the data layer. This separation kept the codebase navigable as the project grew.

### Infrastructure

Deployed on **AWS EC2** with a production-grade setup — reverse proxy, environment config, and persistent MongoDB Atlas connection.`,
        role: 'Full-Stack Engineer',
        startedAt: new Date('2023-07-01'),
        endedAt: new Date('2023-10-01'),
        repoUrl: 'https://github.com/nahyan0077/ecommerce-1-DropShip',
        featured: true,
        published: true,
        displayOrder: 2,
        projectTags: {
          create: [
            { tag: { connect: { slug: 'node' } } },
            { tag: { connect: { slug: 'express' } } },
            { tag: { connect: { slug: 'mongodb' } } },
            { tag: { connect: { slug: 'aws' } } },
            { tag: { connect: { slug: 'typescript' } } },
          ],
        },
      },
    })
    console.log(`Seeded project: ${dropship.title}`)

    // 3. Secure Code Analyzer
    const secureCode = await prisma.project.upsert({
      where: { slug: 'secure-code-analyzer' },
      update: {},
      create: {
        slug: 'secure-code-analyzer',
        title: 'Secure Code Analyzer',
        tagline: 'AI-powered vulnerability detection for source code',
        shortDescription:
          'An AI model that scans source code for security vulnerabilities — detecting common attack vectors like injection flaws, insecure dependencies, and unsafe patterns before they reach production.',
        descriptionMd: `## Secure Code Analyzer

An AI-powered tool that analyses source code and flags security vulnerabilities automatically — the kind of issues that slip through code review and end up in CVE databases.

### What it detects

- SQL / command injection patterns
- Hardcoded secrets and credentials
- Insecure dependency usage
- Unsafe deserialization
- Common OWASP Top 10 patterns

### How it works

The model is trained/fine-tuned to understand code context — not just pattern matching, but understanding intent and data flow to reduce false positives. Input is raw source code; output is a structured vulnerability report with severity levels and remediation hints.

### Why I built it

Security is often an afterthought. This project was an experiment in applying ML to a problem that's usually solved with static analysis rules — and seeing whether a language model can catch things that rule-based scanners miss.`,
        role: 'AI/ML Engineer',
        startedAt: new Date('2024-06-01'),
        repoUrl: 'https://github.com/nahyan0077/secure-code-analyzer-model',
        featured: true,
        published: true,
        displayOrder: 3,
        projectTags: {
          create: [
            { tag: { connect: { slug: 'python' } } },
            { tag: { connect: { slug: 'typescript' } } },
          ],
        },
      },
    })
    console.log(`Seeded project: ${secureCode.title}`)

    // 4. Knowledge OS
    const knowledgeOs = await prisma.project.upsert({
      where: { slug: 'knowledge-os' },
      update: {},
      create: {
        slug: 'knowledge-os',
        title: 'Knowledge OS',
        tagline: 'A personal knowledge management system',
        shortDescription:
          'Knowledge OS is a personal knowledge management tool — a structured way to capture, connect, and retrieve information across projects, notes, and ideas.',
        descriptionMd: `## Knowledge OS

A personal knowledge management system — built because existing tools either did too much or not enough.

The goal: a lightweight but structured way to capture notes, link related ideas, and surface the right information when you need it.

### What it does

- Structured note-taking with markdown support
- Bidirectional linking between notes and concepts
- Tag-based organisation
- Fast full-text search

### Why I built it

Every engineer ends up with scattered notes across Notion, Obsidian, random docs, and browser tabs. Knowledge OS was an attempt to build something opinionated around the way I actually think and work — capturing context, not just content.`,
        role: 'Full-Stack Engineer',
        startedAt: new Date('2024-08-01'),
        repoUrl: 'https://github.com/nahyan0077/knowledge-os',
        featured: false,
        published: true,
        displayOrder: 4,
        projectTags: {
          create: [
            { tag: { connect: { slug: 'react' } } },
            { tag: { connect: { slug: 'typescript' } } },
            { tag: { connect: { slug: 'node' } } },
          ],
        },
      },
    })
    console.log(`Seeded project: ${knowledgeOs.title}`)

    // Example blog post
    const post = await prisma.post.upsert({
      where: { slug: 'hello-world' },
      update: {},
      create: {
        slug: 'hello-world',
        title: 'Hello World',
        excerpt: 'The first post on the blog.',
        contentMd: '## Hello\n\nThis is the first post.',
        readingMinutes: 1,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    })

    console.log(`Seeded post: ${post.title}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
