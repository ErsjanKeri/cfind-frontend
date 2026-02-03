import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie, Shield, BarChart3, Target, Settings } from "lucide-react"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
                <Cookie className="h-4 w-4" />
                <span className="font-medium">Politika e Cookies / Cookie Policy</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground">Politika e Cookies</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Përditësuar më:{" "}
                {new Date().toLocaleDateString("sq-AL", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle>Çfarë janë Cookies?</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm text-muted-foreground">
                  <p>
                    Cookies janë skedarë të vegjël teksti që ruhen në pajisjen tuaj kur vizitoni faqen tonë të
                    internetit. Ato na ndihmojnë të ofrojmë një përvojë më të mirë përdorimi, të analizojmë trafikun dhe
                    të kuptojmë preferencat tuaja.
                  </p>
                  <p className="mt-4 text-foreground font-medium">What are Cookies?</p>
                  <p>
                    Cookies are small text files stored on your device when you visit our website. They help us provide
                    a better user experience, analyze traffic, and understand your preferences.
                  </p>
                </CardContent>
              </Card>

              {/* Cookie Types */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-verified/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-verified" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cookies Esenciale</h3>
                        <p className="text-xs text-muted-foreground">Essential Cookies</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Këto cookies janë të nevojshme për funksionimin bazë të faqes sonë. Ato mundësojnë funksione të
                      tilla si autentikimi, siguria dhe aksesueshmëria. Këto cookies nuk mund të çaktivizohen.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      These cookies are necessary for the basic functioning of our website. They enable features such as
                      authentication, security, and accessibility. These cookies cannot be disabled.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cookies Analitike</h3>
                        <p className="text-xs text-muted-foreground">Analytics Cookies</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Na ndihmojnë të kuptojmë si ndërveprojnë vizitorët me faqen tonë, duke na lejuar të përmirësojmë
                      përvojën e përdoruesit. Të dhënat mblidhen në mënyrë anonime.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Help us understand how visitors interact with our website, allowing us to improve user experience.
                      Data is collected anonymously.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cookies Marketingu</h3>
                        <p className="text-xs text-muted-foreground">Marketing Cookies</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Përdoren për të gjurmuar vizitorët nëpër faqe të ndryshme dhe për të shfaqur reklama relevante.
                      Këto cookies vendosen nga partnerët tanë reklamues.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Used to track visitors across websites and display relevant advertisements. These cookies are set
                      by our advertising partners.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cookies Preferencash</h3>
                        <p className="text-xs text-muted-foreground">Preference Cookies</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mbajnë mend zgjedhjet tuaja si gjuha, monedha dhe cilësime të tjera për të ofruar një përvojë më
                      të personalizuar.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Remember your choices such as language, currency, and other settings to provide a more
                      personalized experience.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Managing Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle>Si t'i Menaxhoni Cookies / How to Manage Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm text-muted-foreground">
                  <p>
                    Ju mund të ndryshoni preferencat tuaja të cookies në çdo kohë duke klikuar butonin "Cilësimet e
                    Cookies" në fund të faqes. Gjithashtu, shumica e shfletuesve ju lejojnë të kontrolloni cookies
                    përmes cilësimeve të tyre.
                  </p>
                  <p className="mt-4">
                    You can change your cookie preferences at any time by clicking the "Cookie Settings" button at the
                    bottom of the page. Additionally, most browsers allow you to control cookies through their settings.
                  </p>
                  <ul className="mt-4 space-y-1">
                    <li>Chrome: Settings → Privacy and Security → Cookies</li>
                    <li>Firefox: Settings → Privacy & Security → Cookies</li>
                    <li>Safari: Preferences → Privacy → Cookies</li>
                    <li>Edge: Settings → Privacy, Search, and Services → Cookies</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Kontakti / Contact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Nëse keni pyetje rreth politikës sonë të cookies, na kontaktoni në:{" "}
                    <a href="mailto:privacy@companyfinder.al" className="text-primary hover:underline">
                      privacy@companyfinder.al
                    </a>
                  </p>
                  <p className="mt-2">
                    If you have questions about our cookie policy, contact us at:{" "}
                    <a href="mailto:privacy@companyfinder.al" className="text-primary hover:underline">
                      privacy@companyfinder.al
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
