"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Globe,
  Building,
  Home,
  ShoppingCart,
  Users,
  Heart,
  Briefcase,
  Scale,
  Phone,
  ExternalLink,
  Search,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
]

const legalAreas = {
  employment: {
    icon: Briefcase,
    title: "Employment Law",
    description: "Workplace rights, contracts, and disputes",
    resources: {
      US: {
        agencies: ["EEOC", "Department of Labor"],
        websites: ["dol.gov", "eeoc.gov"],
        helplines: ["1-800-669-4000 (EEOC)"],
        keyRights: ["At-will employment", "Minimum wage protection", "Anti-discrimination laws"],
      },
      UK: {
        agencies: ["ACAS", "Employment Tribunal"],
        websites: ["acas.org.uk", "gov.uk/employment-tribunals"],
        helplines: ["0300 123 1100 (ACAS)"],
        keyRights: ["Statutory minimum wage", "Holiday entitlement", "Protection from unfair dismissal"],
      },
      CA: {
        agencies: ["Labour Relations Board", "Employment Standards"],
        websites: ["canada.ca/en/employment-social-development"],
        helplines: ["1-800-641-4049"],
        keyRights: ["Employment standards", "Human rights protection", "Workers' compensation"],
      },
      AU: {
        agencies: ["Fair Work Commission", "Fair Work Ombudsman"],
        websites: ["fairwork.gov.au", "fwc.gov.au"],
        helplines: ["13 13 94 (Fair Work)"],
        keyRights: ["National Employment Standards", "Minimum wage protection", "Unfair dismissal protection"],
      },
      DE: {
        agencies: ["Federal Employment Agency", "Labour Courts"],
        websites: ["arbeitsagentur.de", "bmas.de"],
        helplines: ["0800 4 5555 00"],
        keyRights: ["Kündigungsschutz (dismissal protection)", "Minimum wage (Mindestlohn)", "Works council rights"],
      },
      FR: {
        agencies: ["Labour Inspectorate", "Prud'hommes Courts"],
        websites: ["travail-emploi.gouv.fr", "service-public.fr"],
        helplines: ["3939 (Public Service)"],
        keyRights: ["35-hour work week", "Paid vacation (5 weeks)", "Employment contract protection"],
      },
      IN: {
        agencies: ["Ministry of Labour", "Labour Courts"],
        websites: ["labour.gov.in", "epfindia.gov.in"],
        helplines: ["1800-118-005 (Labour)"],
        keyRights: ["Minimum Wages Act", "Provident Fund benefits", "Gratuity Act protection"],
      },
      SG: {
        agencies: ["Ministry of Manpower", "Tripartite Alliance"],
        websites: ["mom.gov.sg", "tal.sg"],
        helplines: ["6438 5122 (MOM)"],
        keyRights: ["Employment Act protection", "CPF contributions", "Work injury compensation"],
      },
    },
  },
  housing: {
    icon: Home,
    title: "Housing & Tenant Rights",
    description: "Rental agreements, landlord disputes, property law",
    resources: {
      US: {
        agencies: ["HUD", "Local Housing Authorities"],
        websites: ["hud.gov", "nolo.com/legal-encyclopedia/landlord-tenant-law"],
        helplines: ["1-800-569-4287 (HUD)"],
        keyRights: ["Fair Housing Act protection", "Security deposit limits", "Habitability standards"],
      },
      UK: {
        agencies: ["Shelter", "Citizens Advice"],
        websites: ["shelter.org.uk", "citizensadvice.org.uk"],
        helplines: ["0808 800 4444 (Shelter)"],
        keyRights: ["Deposit protection", "Notice periods", "Right to quiet enjoyment"],
      },
      CA: {
        agencies: ["Residential Tenancy Branch", "CMHC"],
        websites: ["cmhc-schl.gc.ca"],
        helplines: ["Provincial tenant helplines"],
        keyRights: ["Rent control regulations", "Eviction protection", "Maintenance standards"],
      },
      AU: {
        agencies: ["State Tenancy Tribunals", "Consumer Affairs"],
        websites: ["tenants.org.au", "accc.gov.au"],
        helplines: ["1800 642 642 (Tenants Union)"],
        keyRights: ["Bond protection", "Minimum housing standards", "Notice period requirements"],
      },
      DE: {
        agencies: ["Mieterschutzbund", "Local Housing Authorities"],
        websites: ["mieterschutzbund.de", "bmwsb.bund.de"],
        helplines: ["Local tenant associations"],
        keyRights: ["Rent control (Mietpreisbremse)", "Tenant protection laws", "Deposit limits (3 months)"],
      },
      FR: {
        agencies: ["ADIL", "Prefecture"],
        websites: ["anil.org", "service-public.fr"],
        helplines: ["0820 16 75 75 (ADIL)"],
        keyRights: ["Rent control in certain areas", "Security deposit (1 month)", "Minimum habitability standards"],
      },
      IN: {
        agencies: ["Rent Control Boards", "Consumer Forums"],
        websites: ["mohua.gov.in", "consumerhelpline.gov.in"],
        helplines: ["1915 (Consumer Helpline)"],
        keyRights: ["Rent Control Acts", "Tenant protection laws", "Security deposit regulations"],
      },
      SG: {
        agencies: ["HDB", "Small Claims Tribunal"],
        websites: ["hdb.gov.sg", "statecourts.gov.sg"],
        helplines: ["1800-225-5432 (HDB)"],
        keyRights: ["Tenancy agreements", "Security deposit (1-2 months)", "Maintenance responsibilities"],
      },
    },
  },
  consumer: {
    icon: ShoppingCart,
    title: "Consumer Protection",
    description: "Purchase disputes, warranties, fraud protection",
    resources: {
      US: {
        agencies: ["FTC", "Consumer Financial Protection Bureau"],
        websites: ["consumer.ftc.gov", "consumerfinance.gov"],
        helplines: ["1-877-FTC-HELP"],
        keyRights: ["Truth in advertising", "Fair debt collection", "Credit report accuracy"],
      },
      UK: {
        agencies: ["Trading Standards", "Citizens Advice"],
        websites: ["citizensadvice.org.uk", "gov.uk/consumer-protection-rights"],
        helplines: ["03454 04 05 06"],
        keyRights: ["Consumer Rights Act 2015", "14-day cooling off period", "Faulty goods protection"],
      },
      CA: {
        agencies: ["Competition Bureau", "Provincial Consumer Protection"],
        websites: ["competitionbureau.gc.ca"],
        helplines: ["1-800-348-5358"],
        keyRights: ["Consumer protection acts", "Cooling-off periods", "Warranty rights"],
      },
      AU: {
        agencies: ["ACCC", "State Consumer Affairs"],
        websites: ["accc.gov.au", "consumerlaw.gov.au"],
        helplines: ["1300 302 502 (ACCC)"],
        keyRights: ["Australian Consumer Law", "Consumer guarantees", "Cooling-off periods"],
      },
      DE: {
        agencies: ["Verbraucherzentrale", "Bundeskartellamt"],
        websites: ["verbraucherzentrale.de", "bundeskartellamt.de"],
        helplines: ["Local consumer centers"],
        keyRights: ["14-day return right", "Warranty protection", "Distance selling regulations"],
      },
      FR: {
        agencies: ["DGCCRF", "UFC-Que Choisir"],
        websites: ["economie.gouv.fr/dgccrf", "quechoisir.org"],
        helplines: ["3939 (Public Service)"],
        keyRights: ["Consumer Code protection", "14-day withdrawal right", "Product liability laws"],
      },
      IN: {
        agencies: ["Consumer Protection Authority", "District Consumer Forums"],
        websites: ["consumeraffairs.nic.in", "consumerhelpline.gov.in"],
        helplines: ["1915 (National Consumer Helpline)"],
        keyRights: ["Consumer Protection Act 2019", "Product liability", "E-commerce protection"],
      },
      SG: {
        agencies: ["CASE", "Competition Commission"],
        websites: ["case.org.sg", "cccs.gov.sg"],
        helplines: ["6100 0315 (CASE)"],
        keyRights: ["Consumer Protection Act", "Lemon Law", "Cooling-off periods"],
      },
    },
  },
  family: {
    icon: Heart,
    title: "Family Law",
    description: "Divorce, custody, adoption, domestic relations",
    resources: {
      US: {
        agencies: ["Family Court", "Child Support Enforcement"],
        websites: ["childwelfare.gov", "acf.hhs.gov"],
        helplines: ["1-800-394-3366"],
        keyRights: ["Child custody standards", "Spousal support", "Domestic violence protection"],
      },
      UK: {
        agencies: ["Family Court", "Relate"],
        websites: ["gov.uk/browse/births-deaths-marriages", "relate.org.uk"],
        helplines: ["0300 100 1234 (Relate)"],
        keyRights: ["Children Act provisions", "Financial settlements", "Domestic abuse support"],
      },
      CA: {
        agencies: ["Family Court", "Legal Aid"],
        websites: ["justice.gc.ca/eng/fl-df"],
        helplines: ["Provincial family law helplines"],
        keyRights: ["Best interests of child", "Spousal support guidelines", "Property division"],
      },
      AU: {
        agencies: ["Family Court", "Family Relationship Centres"],
        websites: ["familycourt.gov.au", "ag.gov.au"],
        helplines: ["1800 050 321 (Family Relationships)"],
        keyRights: ["Best interests of child", "Property settlement", "Domestic violence orders"],
      },
      DE: {
        agencies: ["Familiengericht", "Jugendamt"],
        websites: ["bmfsfj.de", "familienportal.de"],
        helplines: ["Local Jugendamt offices"],
        keyRights: ["Parental rights (Sorgerecht)", "Child support (Unterhalt)", "Domestic violence protection"],
      },
      FR: {
        agencies: ["Family Court (JAF)", "CAF"],
        websites: ["justice.gouv.fr", "caf.fr"],
        helplines: ["3939 (Public Service)"],
        keyRights: ["Parental authority", "Child support (pension alimentaire)", "Domestic violence protection"],
      },
      IN: {
        agencies: ["Family Courts", "Women & Child Development"],
        websites: ["wcd.nic.in", "ncw.nic.in"],
        helplines: ["181 (Women Helpline)"],
        keyRights: ["Personal laws", "Domestic Violence Act", "Child custody rights"],
      },
      SG: {
        agencies: ["Family Justice Courts", "MSF"],
        websites: ["familyjusticecourts.gov.sg", "msf.gov.sg"],
        helplines: ["1800-777-0000 (MSF)"],
        keyRights: ["Women's Charter", "Maintenance orders", "Personal protection orders"],
      },
    },
  },
  criminal: {
    icon: Scale,
    title: "Criminal Law",
    description: "Criminal charges, rights, court procedures",
    resources: {
      US: {
        agencies: ["Public Defender", "Legal Aid Society"],
        websites: ["nacdl.org", "nlada.org"],
        helplines: ["Local public defender offices"],
        keyRights: ["Right to remain silent", "Right to attorney", "Presumption of innocence"],
      },
      UK: {
        agencies: ["Legal Aid Agency", "Crown Prosecution Service"],
        websites: ["gov.uk/legal-aid", "cps.gov.uk"],
        helplines: ["0345 345 4 345"],
        keyRights: ["Right to legal representation", "Police caution rights", "Bail considerations"],
      },
      CA: {
        agencies: ["Legal Aid", "Public Prosecution Service"],
        websites: ["justice.gc.ca/eng/csj-sjc/ccs-ajc"],
        helplines: ["Provincial legal aid"],
        keyRights: ["Charter rights", "Right to counsel", "Reasonable bail"],
      },
      AU: {
        agencies: ["Legal Aid", "Director of Public Prosecutions"],
        websites: ["nationallegalaid.org", "cdpp.gov.au"],
        helplines: ["1300 650 579 (Legal Aid)"],
        keyRights: ["Right to silence", "Right to legal representation", "Presumption of innocence"],
      },
      DE: {
        agencies: ["Legal Aid (Prozesskostenhilfe)", "Public Prosecutor"],
        websites: ["bmjv.de", "anwaltverein.de"],
        helplines: ["Local bar associations"],
        keyRights: ["Right to defense counsel", "Presumption of innocence", "Right to remain silent"],
      },
      FR: {
        agencies: ["Legal Aid (Aide Juridictionnelle)", "Public Prosecutor"],
        websites: ["justice.gouv.fr", "cnb.avocat.fr"],
        helplines: ["3939 (Public Service)"],
        keyRights: ["Right to defense", "Presumption of innocence", "Right to interpreter"],
      },
      IN: {
        agencies: ["Legal Services Authority", "Public Prosecutor"],
        websites: ["nalsa.gov.in", "doj.gov.in"],
        helplines: ["15100 (Legal Services)"],
        keyRights: ["Right to legal aid", "Right against self-incrimination", "Right to bail"],
      },
      SG: {
        agencies: ["Legal Aid Bureau", "Attorney-General's Chambers"],
        websites: ["lab.mlaw.gov.sg", "agc.gov.sg"],
        helplines: ["1800-325-1500 (Legal Aid)"],
        keyRights: ["Right to counsel", "Right to remain silent", "Presumption of innocence"],
      },
    },
  },
  business: {
    icon: Building,
    title: "Business Law",
    description: "Contracts, incorporation, intellectual property",
    resources: {
      US: {
        agencies: ["SBA", "USPTO", "SEC"],
        websites: ["sba.gov", "uspto.gov", "sec.gov"],
        helplines: ["1-800-827-5722 (SBA)"],
        keyRights: ["Business formation options", "Intellectual property protection", "Contract enforcement"],
      },
      UK: {
        agencies: ["Companies House", "IPO", "Business Link"],
        websites: [
          "gov.uk/government/organisations/companies-house",
          "gov.uk/government/organisations/intellectual-property-office",
        ],
        helplines: ["0303 123 4500"],
        keyRights: ["Company registration", "Trademark protection", "Commercial law"],
      },
      CA: {
        agencies: ["Corporations Canada", "CIPO"],
        websites: ["ic.gc.ca/eic/site/cd-dgc.nsf/eng/home", "ic.gc.ca/eic/site/cipointernet-internetopic.nsf/eng/home"],
        helplines: ["1-866-333-5556"],
        keyRights: ["Federal incorporation", "Patent protection", "Business regulations"],
      },
      AU: {
        agencies: ["ASIC", "IP Australia", "ACCC"],
        websites: ["asic.gov.au", "ipaustralia.gov.au", "accc.gov.au"],
        helplines: ["1300 300 630 (ASIC)"],
        keyRights: ["Company registration", "Intellectual property protection", "Competition law compliance"],
      },
      DE: {
        agencies: ["DPMA", "Handelsregister", "IHK"],
        websites: ["dpma.de", "handelsregister.de", "ihk.de"],
        helplines: ["Local IHK chambers"],
        keyRights: ["GmbH/AG formation", "Patent and trademark protection", "Commercial code compliance"],
      },
      FR: {
        agencies: ["INPI", "INSEE", "CCI"],
        websites: ["inpi.fr", "insee.fr", "cci.fr"],
        helplines: ["Local CCI chambers"],
        keyRights: ["SARL/SAS formation", "Intellectual property protection", "Commercial regulations"],
      },
      IN: {
        agencies: ["MCA", "Controller of Patents", "CCI"],
        websites: ["mca.gov.in", "ipindia.gov.in", "cci.gov.in"],
        helplines: ["1800-274-4001 (MCA)"],
        keyRights: ["Company incorporation", "Patent and trademark protection", "Competition law"],
      },
      SG: {
        agencies: ["ACRA", "IPOS", "CCCS"],
        websites: ["acra.gov.sg", "ipos.gov.sg", "cccs.gov.sg"],
        helplines: ["6248 6028 (ACRA)"],
        keyRights: ["Company registration", "IP protection", "Competition compliance"],
      },
    },
  },
}

const emergencyContacts = {
  US: [
    { name: "National Domestic Violence Hotline", number: "1-800-799-7233", available: "24/7" },
    { name: "Legal Aid Hotline", number: "211", available: "24/7" },
    { name: "Elder Abuse Hotline", number: "1-800-677-1116", available: "24/7" },
  ],
  UK: [
    { name: "National Domestic Abuse Helpline", number: "0808 2000 247", available: "24/7" },
    { name: "Citizens Advice", number: "03444 111 444", available: "9am-5pm" },
    { name: "Shelter Housing Helpline", number: "0808 800 4444", available: "8am-8pm" },
  ],
  CA: [
    { name: "Assaulted Women's Helpline", number: "1-866-863-0511", available: "24/7" },
    { name: "Legal Aid Ontario", number: "1-800-668-8258", available: "8am-5pm" },
    { name: "Elder Abuse Ontario", number: "1-833-372-7233", available: "24/7" },
  ],
  AU: [
    { name: "1800RESPECT", number: "1800 737 732", available: "24/7" },
    { name: "Legal Aid Australia", number: "1300 650 579", available: "9am-5pm" },
    { name: "Elder Abuse Helpline", number: "1800 353 374", available: "24/7" },
  ],
  DE: [
    { name: "Violence Against Women Helpline", number: "08000 116 016", available: "24/7" },
    { name: "Legal Aid Information", number: "0180 5 123 123", available: "9am-6pm" },
    { name: "Senior Citizens Helpline", number: "0800 111 0 111", available: "24/7" },
  ],
  FR: [
    { name: "National Domestic Violence", number: "3919", available: "24/7" },
    { name: "Legal Aid Information", number: "3939", available: "8:30am-6:30pm" },
    { name: "Elder Abuse Helpline", number: "3977", available: "9am-7pm" },
  ],
  IN: [
    { name: "Women Helpline", number: "181", available: "24/7" },
    { name: "Legal Services Helpline", number: "15100", available: "24/7" },
    { name: "Elder Helpline", number: "14567", available: "24/7" },
  ],
  SG: [
    { name: "AWARE Helpline", number: "1800-777-5555", available: "10am-6pm" },
    { name: "Legal Aid Bureau", number: "1800-325-1500", available: "8:30am-5:30pm" },
    { name: "Silver Generation Helpline", number: "1800-650-6060", available: "8:30am-6pm" },
  ],
}

export function LegalResources() {
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [selectedArea, setSelectedArea] = useState("employment")
  const [searchTerm, setSearchTerm] = useState("")

  const currentCountry = countries.find((c) => c.code === selectedCountry)
  const currentArea = legalAreas[selectedArea as keyof typeof legalAreas]
  const currentResources = currentArea?.resources[selectedCountry as keyof typeof currentArea.resources]

  const filteredAreas = Object.entries(legalAreas).filter(
    ([key, area]) =>
      area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Country and Search Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    {country.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search legal areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedArea} onValueChange={setSelectedArea} className="w-full">
        {/* Legal Area Tabs */}
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {filteredAreas.map(([key, area]) => {
            const Icon = area.icon
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{area.title.split(" ")[0]}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Content for each legal area */}
        {filteredAreas.map(([key, area]) => (
          <TabsContent key={key} value={key}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <area.icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {area.title}
                          <Badge variant="outline">
                            {currentCountry?.flag} {currentCountry?.name}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{area.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentResources && (
                      <>
                        {/* Key Rights */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Your Key Rights
                          </h4>
                          <div className="grid gap-2">
                            {currentResources.keyRights?.map((right, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{right}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Government Agencies */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            Government Agencies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentResources.agencies?.map((agency, index) => (
                              <Badge key={index} variant="secondary">
                                {agency}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Helpful Websites */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-purple-600" />
                            Official Resources
                          </h4>
                          <div className="grid gap-2">
                            {currentResources.websites?.map((website, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="justify-start h-auto p-3 bg-transparent"
                              >
                                <ExternalLink className="h-3 w-3 mr-2" />
                                <span className="text-xs">{website}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Emergency Contacts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="h-5 w-5 text-red-600" />
                      Emergency Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {emergencyContacts[selectedCountry as keyof typeof emergencyContacts]?.map((contact, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-1">
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-lg font-mono text-primary">{contact.number}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {contact.available}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* When to Get Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      When to Get Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        <div className="text-sm">
                          <div className="font-medium text-red-700">Immediate Legal Action Needed</div>
                          <div className="text-muted-foreground">
                            Criminal charges, court summons, restraining orders
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                        <div className="text-sm">
                          <div className="font-medium text-amber-700">Complex Situations</div>
                          <div className="text-muted-foreground">
                            Large contracts, business disputes, property transactions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div className="text-sm">
                          <div className="font-medium text-green-700">Preventive Consultation</div>
                          <div className="text-muted-foreground">
                            Document review, legal planning, rights clarification
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Find Local Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Find Local Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MapPin className="h-4 w-4 mr-2" />
                        Legal Aid Near You
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        Bar Association Directory
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Scale className="h-4 w-4 mr-2" />
                        Court Self-Help Centers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
