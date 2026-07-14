import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({ url: "file:D:/claude_project/umawall/dev.db" });
const adapter = new PrismaLibSql(libsql);

console.log("Adapter:", adapter);

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const count = await prisma.user.count();
    console.log("User count:", count);
    
    const users = await prisma.user.findMany();
    console.log("Users:", users.length);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
