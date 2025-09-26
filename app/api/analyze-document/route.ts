import { type NextRequest, NextResponse } from "next/server"

const MAX_FILE_CHARS = 4000 // Reduced to save tokens
const MAX_OUTPUT_TOKENS = 512
const MAX_RETRY_ATTEMPTS = 3
const BASE_RETRY_DELAY = 2000 // 2 seconds

// Lightest models first to conserve quota
const MODELS_TO_TRY = [
  'gemini-2.5-flash-lite',      // Lightest available model
  'gemini-2.0-flash-lite',      // Auto-updated alias for lite
  'gemini-2.0-flash-lite-001',  // Specific lite version
  'gemini-2.5-flash',           // Next lightest
  'gemini-2.0-flash',           // Auto-updated alias
  'gemini-2.0-flash-001',       // Specific flash version
  'gemini-1.5-flash-latest',    // Fallback to older flash
  'gemini-1.5-flash'            // Final fallback
]

// Sleep function for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function tryModelRequest(apiKey: string, requestBody: any, model: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  )
  return response
}

// Ultra-simplified request body to minimize token usage
function createDocumentAnalysisRequest(fileContent: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: `Legal doc analyzer. Brief analysis with disclaimer.

Doc: ${fileContent}

Provide: summary, key points, risks, advice. Keep concise.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      topP: 0.8,
      topK: 10,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const apiKey = formData.get("apiKey") as string

    if (!file || !apiKey) {
      return NextResponse.json({ error: "File and API key are required" }, { status: 400 })
    }

    // Validate API key format
    if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
      return NextResponse.json(
        { error: "Invalid Gemini API key format" },
        { status: 400 }
      )
    }

    // Read and truncate file content
    const fileContent = await file.text()
    const truncatedContent = fileContent.slice(0, MAX_FILE_CHARS)

    if (!truncatedContent.trim()) {
      return NextResponse.json({ error: "File appears to be empty" }, { status: 400 })
    }

    const requestBody = createDocumentAnalysisRequest(truncatedContent)

    console.log("Analyzing document with Gemini API...")

    let lastError = null
    let retryCount = 0

    // Try each model until one works
    for (const model of MODELS_TO_TRY) {
      retryCount = 0

      while (retryCount < MAX_RETRY_ATTEMPTS) {
        try {
          console.log(`Trying model: ${model} (attempt ${retryCount + 1})`)
          const response = await tryModelRequest(apiKey, requestBody, model)

          console.log(`Response status for ${model}: ${response.status}`)

          if (response.ok) {
            console.log(`✅ Success with model: ${model}`)

            const data = await response.json()
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Could not analyze document."

            // Create structured response
            const analysis = {
              summary: aiResponse,
              model: model,
              attempt: retryCount + 1,
              fileSize: fileContent.length,
              truncated: fileContent.length > MAX_FILE_CHARS,
              keyPoints: ["Analysis completed", "Document processed successfully"],
              risks: ["Please review AI analysis carefully", "This is not legal advice"],
              recommendations: [
                "Consult a licensed attorney for important documents",
                "Review all terms before signing",
                "Keep copies of signed documents"
              ]
            }

            return NextResponse.json({ analysis })
          } else {
            const errorText = await response.text()
            console.log(`❌ Model ${model} failed with status ${response.status}`)

            let parsedError = null
            try {
              parsedError = JSON.parse(errorText)
            } catch (e) {
              // Error text is not JSON
            }

            lastError = { status: response.status, text: errorText, model, parsedError }

            // Handle different error types
            if (response.status === 429) {
              // Rate limit exceeded - extract retry delay
              let retryDelay = BASE_RETRY_DELAY * (retryCount + 1)

              if (parsedError?.error?.details) {
                const retryInfo = parsedError.error.details.find(
                  (detail: any) => detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
                )
                if (retryInfo?.retryDelay) {
                  const delayMatch = retryInfo.retryDelay.match(/(\d+(?:\.\d+)?)s/)
                  if (delayMatch) {
                    retryDelay = Math.ceil(parseFloat(delayMatch[1]) * 1000)
                  }
                }
              }

              if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
                console.log(`Rate limited. Waiting ${retryDelay}ms before retry...`)
                await sleep(retryDelay)
                retryCount++
                continue
              } else {
                console.log(`Max retries reached for model ${model}`)
                break
              }
            } else if (response.status === 401 || response.status === 403) {
              // Auth errors - don't retry
              console.log("Authentication error - stopping retries")
              break
            } else if (response.status === 404) {
              // Model not found - try next model
              console.log(`Model ${model} not available - trying next model`)
              break
            } else {
              // Other errors - retry with exponential backoff
              if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
                const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount)
                console.log(`Server error. Waiting ${delay}ms before retry...`)
                await sleep(delay)
                retryCount++
                continue
              } else {
                break
              }
            }
          }
        } catch (error) {
          console.log(`❌ Network error with model ${model}:`, error)
          lastError = { error: error.message || error, model }

          if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
            const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount)
            console.log(`Network error. Waiting ${delay}ms before retry...`)
            await sleep(delay)
            retryCount++
            continue
          } else {
            break
          }
        }
      }
    }

    // If we get here, all models failed
    console.error("All models failed. Last error:", lastError)

    // Provide specific error messages
    if (lastError?.status === 403 || lastError?.status === 401) {
      return NextResponse.json(
        { error: "API key is invalid or doesn't have permission. Please check your Gemini API key." },
        { status: 403 }
      )
    }

    if (lastError?.status === 429) {
      const quotaInfo = lastError?.parsedError?.error?.details?.find(
        (detail: any) => detail["@type"] === "type.googleapis.com/google.rpc.QuotaFailure"
      )

      let errorMessage = "You've exceeded your Gemini API quota limits."

      if (quotaInfo?.violations?.some((v: any) => v.quotaId?.includes("FreeTier"))) {
        errorMessage += " You're on the free tier and have hit your daily limits. Consider upgrading to a paid plan or wait for the quota to reset."
      }

      return NextResponse.json(
        {
          error: errorMessage,
          quotaExceeded: true,
          suggestions: [
            "Wait for quota reset (daily limits reset at midnight PT)",
            "Upgrade to paid tier at https://aistudio.google.com/",
            "Try analyzing smaller documents",
            "Try again in a few minutes"
          ]
        },
        { status: 429 }
      )
    }

    if (lastError?.status === 404) {
      return NextResponse.json(
        { error: "None of the Gemini models are accessible. This might be a regional availability issue." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: `Document analysis failed: ${lastError?.status || 'Unknown error'}. Please try again.` },
      { status: lastError?.status || 500 }
    )

  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 })
  }
}