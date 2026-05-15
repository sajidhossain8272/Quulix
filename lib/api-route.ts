import { NextResponse } from "next/server";

export function apiErrorResponse(error: unknown, fallbackMessage: string) {
  console.error(fallbackMessage, error);

  const message =
    error instanceof Error ? error.message : fallbackMessage;

  if (message.includes("does not exist")) {
    return NextResponse.json(
      {
        message:
          "Store database is not initialized. Run prisma migrate deploy and db seed.",
      },
      { status: 503 },
    );
  }

  if (
    message.includes("Environment variable not found") ||
    message.includes("DATABASE_URL")
  ) {
    return NextResponse.json(
      { message: "Database is not configured for this deployment." },
      { status: 503 },
    );
  }

  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
