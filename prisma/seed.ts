import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const passwordSuperadmin = await bcrypt.hash(
    'password-superadmin',
    roundsOfHashing,
  );

  const user1 = await prisma.user.upsert({
    where: { email: 'superadmin@yopmail.com' },
    update: {
      password: passwordSuperadmin,
    },
    create: {
      email: 'superadmin@yopmail.com',
      name: 'Super Admin',
      password: passwordSuperadmin,
      role: Role.SUPER_ADMIN,
    },
  });

  const passwordModerator = await bcrypt.hash(
    'password-moderator',
    roundsOfHashing,
  );
  const user2 = await prisma.user.upsert({
    where: { email: 'moderator@yopmail.com' },
    update: {
      password: passwordModerator,
    },
    create: {
      email: 'moderator@yopmail.com',
      name: 'Moderator',
      password: passwordModerator,
    },
  });

  const passwordCompanyAdmin = await bcrypt.hash(
    'password-companyadmin',
    roundsOfHashing,
  );
  const user3 = await prisma.user.upsert({
    where: { email: 'companyadmin@yopmail.com' },
    update: {
      password: passwordCompanyAdmin,
    },
    create: {
      email: 'companyadmin@yopmail.com',
      name: 'Company Admin',
      password: passwordCompanyAdmin,
    },
  });

  const passwordUser = await bcrypt.hash(
    'password-companyadmin',
    roundsOfHashing,
  );
  const user4 = await prisma.user.upsert({
    where: { email: 'user@yopmail.com' },
    update: {
      password: passwordUser,
    },
    create: {
      email: 'user@yopmail.com',
      name: 'User',
      password: passwordUser,
    },
  });

  // create three dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      isPublished: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      isPublished: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.article.upsert({
    where: { title: 'Prisma Client Just Became a Lot More Flexible' },
    update: {
      authorId: user3.id,
    },
    create: {
      title: 'Prisma Client Just Became a Lot More Flexible',
      body: 'Prisma Client extensions provide a powerful new way to add functionality to Prisma in a type-safe manner...',
      description:
        'This article will explore various ways you can use Prisma Client extensions to add custom functionality to Prisma Client..',
      isPublished: true,
      authorId: user3.id,
    },
  });

  console.log({ user1, user2, post1, post2, post3 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
