import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, apiKey } = await request.json()

    console.log("Received message:", message)
    console.log("API key provided:", !!apiKey)

    if (!message || !apiKey) {
      return NextResponse.json({ error: "Message and API key are required" }, { status: 400 })
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are LegalEase, an AI legal assistant. Your role is to help people understand legal issues in simple, clear language. 

IMPORTANT GUIDELINES:
- Always provide a clear disclaimer that this is informational only, not legal advice
- Explain legal concepts in plain English
- Suggest when someone should consult a licensed lawyer
- Focus on general legal principles and common scenarios
- Be helpful but emphasize the importance of professional legal counsel for serious matters

User question: ${message}

Please provide a helpful, informative response while following the guidelines above.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }

    console.log("[v0] Request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Error response:", errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(" Response data:", JSON.stringify(data, null, 2))

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I could not generate a response. Please try again."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
