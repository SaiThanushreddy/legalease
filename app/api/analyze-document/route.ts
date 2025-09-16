import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const apiKey = formData.get("apiKey") as string

    if (!file || !apiKey) {
      return NextResponse.json({ error: "File and API key are required" }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()

    // Truncate if too long (Gemini has token limits)
    const truncatedContent = fileContent.slice(0, 8000)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are LegalEase, an AI legal document analyzer. Analyze the following legal document and provide:

1. A brief summary of what this document is about
2. Key points and important clauses
3. Potential risks or concerning elements
4. Recommendations for the reader

IMPORTANT: Always include a disclaimer that this is informational analysis only, not legal advice, and recommend consulting a lawyer for important documents.

Document content:
${truncatedContent}

Please provide your analysis in a structured format.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze document."

    // Parse the response into structured format
    const analysis = {
      summary: "Document analysis completed. Please review the detailed breakdown below.",
      keyPoints: ["Key terms and conditions identified", "Important clauses highlighted", "Legal obligations outlined"],
      risks: ["Potential areas of concern noted", "Clauses requiring attention identified"],
      recommendations: [
        "Consider consulting a licensed attorney for important documents",
        "Review all terms carefully before signing",
        "Keep copies of all signed documents",
      ],
    }

    // In a real implementation, you would parse the AI response more intelligently
    // For now, we'll return a structured response with the AI content in summary
    analysis.summary = aiResponse

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 })
  }
}
