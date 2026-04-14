# ITENAS AICHE Backend

Consists of 2 main projects (Monorepo):
- **Backend**: Server codes.
- **Admin**: UI for managing server.

## Backend

> Runs on port 5419

Bun + Elysia + Postgresql


**Make sure Postgresql is running.**

### How to Run

1. Change directory
```
cd backend
```

2. Install dependencies.
```
bun install
```

3. Generate Prisma client.
``` 
bunx --bun prisma generate
```

4. Run.
```
bun dev
```

## Admin

> Runs on port 5420

Vite + Tanstack Router + Eden Treaty

### How to Run

1. Change directory
```
cd admin
```

2. Install dependencies.
```
pnpm install
```

3. Run.
```
pnpm dev
```