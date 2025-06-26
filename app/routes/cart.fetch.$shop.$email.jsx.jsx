import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader() {
  const sessions = await prisma.session.findMany();

  const serialized = sessions.map((s) => ({
    ...s,
    userId: s.userId?.toString() || null, // convert BigInt to string
  }));

  return json({
    ok: true,
    sessions: serialized,
  });
}
