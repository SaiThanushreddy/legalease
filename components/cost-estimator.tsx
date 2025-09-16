"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, DollarSign, Clock, MapPin, Scale, FileText, Plus, X } from "lucide-react"

interface CostEstimate {
  lawyerFees: { min: number; max: number }
  courtFees: number
  additionalCosts: { name: string; amount: number }[]
  totalEstimate: { min: number; max: number }
  timeframe: string
  complexity: string
  breakdown: string[]
}

interface AdditionalFactor {
  id: string
  name: string
  description: string
  cost: number
}

export function CostEstimator() {
  const [caseType, setCaseType] = useState("")
  const [location, setLocation] = useState("")
  const [complexity, setComplexity] = useState("")
  const [caseDescription, setCaseDescription] = useState("")
  const [urgency, setUrgency] = useState("")
  const [lawyerExperience, setLawyerExperience] = useState("")
  const [additionalFactors, setAdditionalFactors] = useState<AdditionalFactor[]>([])
  const [estimate, setEstimate] = useState<CostEstimate | null>(null)

  const availableFactors = [
    { id: "expert-witness", name: "Expert Witness", description: "Professional testimony", cost: 2000 },
    { id: "document-review", name: "Document Review", description: "Extensive document analysis", cost: 1500 },
    { id: "mediation", name: "Mediation Services", description: "Alternative dispute resolution", cost: 800 },
    { id: "investigation", name: "Private Investigation", description: "Fact-finding services", cost: 3000 },
    { id: "translation", name: "Translation Services", description: "Document translation", cost: 500 },
    { id: "travel-expenses", name: "Travel Expenses", description: "Court appearances in other cities", cost: 1000 },
  ]

  const addFactor = (factorId: string) => {
    const factor = availableFactors.find((f) => f.id === factorId)
    if (factor && !additionalFactors.find((f) => f.id === factorId)) {
      setAdditionalFactors([...additionalFactors, factor])
    }
  }

  const removeFactor = (factorId: string) => {
    setAdditionalFactors(additionalFactors.filter((f) => f.id !== factorId))
  }

  const calculateEstimate = () => {
    if (!caseType || !location || !complexity) return

    const baseRates = {
      "small-claims": { min: 200, max: 500, court: 50 },
      employment: { min: 2000, max: 8000, court: 200 },
      "landlord-tenant": { min: 500, max: 2000, court: 100 },
      "contract-dispute": { min: 1500, max: 6000, court: 150 },
      "personal-injury": { min: 3000, max: 15000, court: 300 },
      divorce: { min: 2500, max: 10000, court: 250 },
      "criminal-defense": { min: 5000, max: 25000, court: 500 },
      "business-law": { min: 3000, max: 12000, court: 300 },
      immigration: { min: 1500, max: 5000, court: 400 },
      "intellectual-property": { min: 4000, max: 20000, court: 600 },
    }

    const complexityMultiplier = {
      simple: 1,
      moderate: 1.5,
      complex: 2.5,
    }

    const locationMultiplier = {
      urban: 1.3,
      suburban: 1,
      rural: 0.8,
    }

    const urgencyMultiplier = {
      standard: 1,
      urgent: 1.3,
      emergency: 1.6,
    }

    const experienceMultiplier = {
      junior: 0.7,
      mid: 1,
      senior: 1.4,
      partner: 2,
    }

    const base = baseRates[caseType as keyof typeof baseRates]
    const complexMult = complexityMultiplier[complexity as keyof typeof complexityMultiplier]
    const locMult = locationMultiplier[location as keyof typeof locationMultiplier]
    const urgMult = urgencyMultiplier[urgency as keyof typeof urgencyMultiplier] || 1
    const expMult = experienceMultiplier[lawyerExperience as keyof typeof experienceMultiplier] || 1

    const lawyerMin = Math.round(base.min * complexMult * locMult * urgMult * expMult)
    const lawyerMax = Math.round(base.max * complexMult * locMult * urgMult * expMult)
    const courtFees = base.court

    const additionalCosts = additionalFactors.map((factor) => ({
      name: factor.name,
      amount: factor.cost,
    }))

    const additionalTotal = additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)

    const breakdown = [
      `Base ${caseType.replace("-", " ")} case: $${base.min.toLocaleString()} - $${base.max.toLocaleString()}`,
      `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} complexity: ${Math.round((complexMult - 1) * 100)}% adjustment`,
      `${location.charAt(0).toUpperCase() + location.slice(1)} location: ${Math.round((locMult - 1) * 100)}% adjustment`,
    ]

    if (urgency && urgency !== "standard") {
      breakdown.push(
        `${urgency.charAt(0).toUpperCase() + urgency.slice(1)} timeline: ${Math.round((urgMult - 1) * 100)}% adjustment`,
      )
    }

    if (lawyerExperience && lawyerExperience !== "mid") {
      breakdown.push(
        `${lawyerExperience.charAt(0).toUpperCase() + lawyerExperience.slice(1)} lawyer: ${Math.round((expMult - 1) * 100)}% adjustment`,
      )
    }

    setEstimate({
      lawyerFees: { min: lawyerMin, max: lawyerMax },
      courtFees,
      additionalCosts,
      totalEstimate: {
        min: lawyerMin + courtFees + additionalTotal,
        max: lawyerMax + courtFees + additionalTotal,
      },
      timeframe: complexity === "simple" ? "1-3 months" : complexity === "moderate" ? "3-8 months" : "8-18 months",
      complexity: complexity.charAt(0).toUpperCase() + complexity.slice(1),
      breakdown,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Advanced Legal Cost Estimator
          </CardTitle>
          <CardDescription>Get detailed estimates for legal fees with customizable factors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="case-type">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small-claims">Small Claims</SelectItem>
                  <SelectItem value="employment">Employment Issue</SelectItem>
                  <SelectItem value="landlord-tenant">Landlord-Tenant</SelectItem>
                  <SelectItem value="contract-dispute">Contract Dispute</SelectItem>
                  <SelectItem value="personal-injury">Personal Injury</SelectItem>
                  <SelectItem value="divorce">Divorce & Family Law</SelectItem>
                  <SelectItem value="criminal-defense">Criminal Defense</SelectItem>
                  <SelectItem value="business-law">Business Law</SelectItem>
                  <SelectItem value="immigration">Immigration</SelectItem>
                  <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Type</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban/City (Higher rates)</SelectItem>
                  <SelectItem value="suburban">Suburban (Standard rates)</SelectItem>
                  <SelectItem value="rural">Rural (Lower rates)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Case Complexity</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Straightforward)</SelectItem>
                  <SelectItem value="moderate">Moderate (Some complications)</SelectItem>
                  <SelectItem value="complex">Complex (Multiple issues)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Timeline</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Timeline</SelectItem>
                  <SelectItem value="urgent">Urgent (Rush fees apply)</SelectItem>
                  <SelectItem value="emergency">Emergency (Premium rates)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lawyer-experience">Preferred Lawyer Experience</Label>
              <Select value={lawyerExperience} onValueChange={setLawyerExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior Lawyer (Lower rates)</SelectItem>
                  <SelectItem value="mid">Mid-level (Standard rates)</SelectItem>
                  <SelectItem value="senior">Senior Lawyer (Higher rates)</SelectItem>
                  <SelectItem value="partner">Partner/Specialist (Premium rates)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-description">Case Description (Optional)</Label>
            <Textarea
              id="case-description"
              placeholder="Briefly describe your case to help with accuracy..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <Label>Additional Cost Factors</Label>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {availableFactors
                .filter((factor) => !additionalFactors.find((f) => f.id === factor.id))
                .map((factor) => (
                  <Button
                    key={factor.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addFactor(factor.id)}
                    className="justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{factor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {factor.description} - ${factor.cost.toLocaleString()}
                      </div>
                    </div>
                  </Button>
                ))}
            </div>

            {additionalFactors.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Additional Factors:</Label>
                <div className="flex flex-wrap gap-2">
                  {additionalFactors.map((factor) => (
                    <Badge key={factor.id} variant="secondary" className="flex items-center gap-1">
                      {factor.name} (${factor.cost.toLocaleString()})
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFactor(factor.id)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={calculateEstimate} className="w-full" disabled={!caseType || !location || !complexity}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Detailed Estimate
          </Button>
        </CardContent>
      </Card>

      {estimate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Detailed Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4" />
                    <h4 className="font-medium">Lawyer Fees</h4>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    ${estimate.lawyerFees.min.toLocaleString()} - ${estimate.lawyerFees.max.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <h4 className="font-medium">Court Fees</h4>
                  </div>
                  <p className="text-2xl font-bold">${estimate.courtFees.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <h4 className="font-medium">Timeline</h4>
                  </div>
                  <p className="text-lg font-semibold">{estimate.timeframe}</p>
                </div>
              </div>

              {estimate.additionalCosts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Additional Costs</h4>
                  <div className="space-y-2">
                    {estimate.additionalCosts.map((cost, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>{cost.name}</span>
                        <span className="font-medium">${cost.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 text-lg">Total Estimated Cost</h4>
                <p className="text-4xl font-bold text-primary">
                  ${estimate.totalEstimate.min.toLocaleString()} - ${estimate.totalEstimate.max.toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Cost Calculation Breakdown</h4>
                <div className="space-y-1 text-sm">
                  {estimate.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location.charAt(0).toUpperCase() + location.slice(1)} Area
                </Badge>
                <Badge variant="secondary">Complexity: {estimate.complexity}</Badge>
                {urgency && urgency !== "standard" && (
                  <Badge variant="secondary">{urgency.charAt(0).toUpperCase() + urgency.slice(1)} Timeline</Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="font-medium text-amber-800">Important Disclaimers:</p>
                <ul className="space-y-1 text-amber-700">
                  <li>• These are rough estimates based on typical cases and may vary significantly</li>
                  <li>• Actual costs depend on case specifics, lawyer rates, and unforeseen complications</li>
                  <li>• Many lawyers offer free consultations to provide more accurate estimates</li>
                  <li>• Consider payment plans, legal aid, or pro bono services if cost is a concern</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
