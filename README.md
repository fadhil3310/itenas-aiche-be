# ITENAS AICHE Backend

Consists of 2 main projects (Monorepo):
- **Backend**: Server codes.
- **Admin**: UI for managing server.

## Backend

> Runs on port 5419

Bun + Elysia + Postgresql


**Make sure Postgresql is running.**

### How to Run

1. Install dependencies.
```
bun install
```

2. Generate Prisma client.
``` 
bunx --bun prisma generate
```

3. Run.
```
bun dev
```

## Admin

> Runs on port 5420

Vite + Tanstack Router + Eden Treaty

### How to Run

1. Install dependencies.
```
pnpm install
```

2. Run.
```
pnpm dev
```