import { NextResponse } from "next/server";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { name, email, imageURL } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    if (existingUser[0]) {
      return NextResponse.json({ success: true, user: existingUser[0] });
    }

    const insertedUser = await db
      .insert(Users)
      .values({
        name: name || email,
        email,
        imageURL,
      })
      .returning();

    return NextResponse.json({ success: true, user: insertedUser[0] });
  } catch (err) {
    console.error("Failed to sync user:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
