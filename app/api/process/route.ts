import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid input provided" }, { status: 400 })
    }
    
    return NextResponse.json({ output: input })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
