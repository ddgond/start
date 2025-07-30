/**
 * Grant admin rights to a user by email.
 * Usage examples:
 *   pnpm grant-admin:dev user@example.com
 *   pnpm grant-admin:prod user@example.com
 */
import 'dotenv/config';
import { prisma } from '../db.js';

async function main() {
  const [, , arg] = process.argv;

  if (!arg) {
    console.error(
      'Missing user identifier.\nExample: ts-node grantAdmin.ts alice@example.com'
    );
    process.exit(1);
  }

  const where = { email: arg };

  const user = await prisma.user.findFirst({ where });

  if (!user) {
    console.error('❌  User not found with email', arg);
    process.exit(1);
  }

  if (user.isAdmin) {
    console.info('ℹ️  User is already an admin');
    process.exit(0);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isAdmin: true },
  });

  console.info(`✅  User ${user.email} (id ${user.id}) is now an admin`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
