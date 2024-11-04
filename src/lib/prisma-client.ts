// src/lib/prisma-client.ts
const { PrismaClient } = require('@prisma/client')

declare global {
  var prisma: typeof PrismaClient | undefined
}

const prismaClient = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient
}

module.exports = prismaClient