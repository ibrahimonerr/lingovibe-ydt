import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z"
        className="fill-ink-400"
      />
      <path
        d="M19 13l.7 3L22 17l-2.3 1-.7 3-.7-3L16 17l2.3-1 .7-3Z"
        className="fill-white/70"
      />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 7 9.5 17.5 4 12"
        className="stroke-white/80"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Feature({
  title,
  description,
  bullets,
  accent
}: {
  title: string;
  description: string;
  bullets: string[];
  accent: "custom" | "news" | "grammar";
}) {
  const accentCls =
    accent === "custom"
      ? "from-ink-500/20 via-ink-500/0 to-transparent"
      : accent === "news"
        ? "from-fuchsia-500/18 via-fuchsia-500/0 to-transparent"
        : "from-emerald-400/14 via-emerald-400/0 to-transparent";

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentCls}`}
      />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
            <SparkleIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {bullets.map((b) => (
            <div key={b} className="flex items-start gap-2 text-sm text-white/80">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="leading-6">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="py-6">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
              <span className="text-sm font-semibold tracking-tight">LV</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                LingoVibe
              </div>
              <div className="text-xs text-white/60">Learn with real content</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" href="#features">
              Features
            </Button>
            <Button variant="secondary" size="sm" href="#cta">
              Get started
            </Button>
          </div>
        </Container>
      </header>

      <main>
        <section className="pt-10 sm:pt-14">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mx-auto">
                Built for consistency • delightful by default
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Learn a language with{" "}
                <span className="bg-gradient-to-r from-white via-white to-ink-200 bg-clip-text text-transparent">
                  content you actually want to read
                </span>
                .
              </h1>
              <p className="mt-4 text-pretty text-base leading-7 text-white/70 sm:text-lg">
                LingoVibe turns your interests into a daily learning habit:
                import any text, read today’s news in your level, and practice
                grammar with short, satisfying drills.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" href="#cta">
                  Start learning
                </Button>
                <Button size="lg" variant="secondary" href="#features">
                  See the features
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { k: "5–10 min", v: "Daily sessions" },
                  { k: "Your interests", v: "Custom reading" },
                  { k: "Clear feedback", v: "Grammar practice" }
                ].map((s) => (
                  <Card key={s.k} className="px-5 py-4">
                    <div className="text-sm font-semibold">{s.k}</div>
                    <div className="mt-1 text-xs text-white/65">{s.v}</div>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id="features" className="pt-14 sm:pt-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Three ways to learn, one steady streak
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
                Mix and match. Everything is designed to keep you moving forward
                without overwhelm.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Feature
                accent="custom"
                title="Custom text"
                description="Paste anything: articles, subtitles, notes, or a book chapter."
                bullets={[
                  "Instantly turn text into a focused reading session",
                  "Save vocabulary you meet naturally in context",
                  "Quick comprehension checks to lock it in"
                ]}
              />
              <Feature
                accent="news"
                title="Daily news"
                description="Fresh, bite-sized stories tailored to your level."
                bullets={[
                  "Stay consistent with a daily, curated feed",
                  "Learn vocabulary from real-world topics",
                  "Build a habit with short sessions that end cleanly"
                ]}
              />
              <Feature
                accent="grammar"
                title="Grammar"
                description="Short lessons and drills that make rules feel obvious."
                bullets={[
                  "Practice the exact point you’re currently missing",
                  "Fast feedback — no long worksheets",
                  "Review just-in-time so it sticks"
                ]}
              />
            </div>
          </Container>
        </section>

        <section id="cta" className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <Card className="relative overflow-hidden p-7 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(91,124,255,0.25),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(217,70,239,0.16),transparent_55%)]" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Ready to make language learning feel effortless?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/70 sm:text-base">
                    This is a starter build — next we can add auth, a reading
                    screen, and saved vocabulary. For now, you’ve got a polished
                    landing page and clean structure to grow from.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="lg" href="#">
                    Create your profile
                  </Button>
                  <Button size="lg" variant="secondary" href="#features">
                    Explore
                  </Button>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
              <span className="text-xs font-semibold">LV</span>
            </div>
            <span>© {new Date().getFullYear()} LingoVibe</span>
          </div>
          <div className="text-sm text-white/60">
            Custom text • Daily news • Grammar
          </div>
        </Container>
      </footer>
    </div>
  );
}

