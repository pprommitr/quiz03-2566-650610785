import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Pinnaree Prommitr",
    studentId: "650610785",
  });
};
