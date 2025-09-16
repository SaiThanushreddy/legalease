"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChatInterface } from "@/components/chat-interface"
import { DocumentUpload } from "@/components/document-upload"
import { CostEstimator } from "@/components/cost-estimator"
import { Scale, MessageSquare, Upload, Calculator, Shield, AlertTriangle } from "lucide-react"
import { LegalResources } from "@/components/legal-resources"

export default function HomePage() {
  const [apiKey, setApiKey] = useState()
  const [activeTab, setActiveTab] = useState("chat")

console.log(process.env.NEXT_PUBLIC_GEMINI_API)

  return (
    <div className="overflow-hidden">
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">LegalEase</h1>
                <p className="text-sm text-muted-foreground">Your AI Legal Assistant</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Powered by Gemini AI
            </Badge>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <Alert className="mx-4 mt-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Important:</strong> This is informational only, not legal advice. Always consult a licensed lawyer for
          serious legal matters.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Legal Q&A
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Document Analysis
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Cost Estimator
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatInterface apiKey={process.env.NEXT_PUBLIC_GEMINI_API!} />
          </TabsContent>

          <TabsContent value="document">
            <DocumentUpload apiKey={process.env.NEXT_PUBLIC_GEMINI_API!} />
          </TabsContent>

          <TabsContent value="cost">
            <CostEstimator />
          </TabsContent>

          <TabsContent value="resources">
            <LegalResources />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">LegalEase AI Assistant - Empowering informed legal decisions</p>
          <p className="text-xs text-muted-foreground mt-2">Not a substitute for professional legal advice</p>
        </div>
      </footer>
    </div>
    </div>
  )
}
