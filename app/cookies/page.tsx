import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie, Shield, BarChart3, Target, Settings } from "lucide-react"
import { SUPPORT_EMAIL } from "@/lib/constants"

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
                <span className="font-medium">Cookie Policy</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle>What are Cookies?</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm text-muted-foreground">
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
                      <h3 className="font-semibold text-foreground">Essential Cookies</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-semibold text-foreground">Preference Cookies</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remember your choices such as language, currency, and other settings to provide a more
                      personalized experience.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Managing Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Manage Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm text-muted-foreground">
                  <p>
                    You can change your cookie preferences at any time by clicking the &quot;Cookie Settings&quot; button at the
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
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    If you have questions about our cookie policy, contact us at:{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                      {SUPPORT_EMAIL}
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
