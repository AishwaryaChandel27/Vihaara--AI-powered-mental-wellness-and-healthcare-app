import { Leaf, LockKeyhole, Cpu, HeartHandshake } from "lucide-react";
import { Link } from "wouter";
export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <p className="eyebrow mb-3">A QUIETER KIND OF TECHNOLOGY</p>
      <h1 className="mb-6">A little room for being human.</h1>
      <div className="bg-card border rounded-2xl p-7 mb-5">
        <p className="text-lg font-heading leading-relaxed">
          Vihaara is a personal space for reflection, mood check-ins, and
          everyday wellbeing. It brings a gentle rhythm to your day, with
          technology that leaves your words on your device.
        </p>
        <div className="grid sm:grid-cols-2 gap-7 mt-8">
          {[
            {
              icon: Leaf,
              title: "Small moments of care",
              text: "Journaling, breathing, grounding, and ambient sound. No streaks to lose, no pressure to perform.",
            },
            {
              icon: LockKeyhole,
              title: "Your words stay here",
              text: "Journals, mood history, and chat are saved in this browser’s localStorage, without encryption. Someone with access to this browser profile may read them. There is no account or cloud sync.",
            },
            {
              icon: Cpu,
              title: "Free, local intelligence",
              text: "The default offline guide uses prepared prompts and word matching. Optional SmolLM2 runs through WebLLM in your browser. It requires a model download, WebGPU, and sufficient memory; no paid inference service or API key is used.",
            },
            {
              icon: HeartHandshake,
              title: "Support, with honest limits",
              text: "Vihaara is not a therapist, a medical device, a diagnosis tool, or an emergency service. AI can misunderstand you or generate incorrect advice. Persistent or concerning symptoms deserve qualified professional care.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <section key={title}>
              <Icon size={23} className="text-primary mb-3" />
              <h2 className="text-xl mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text}
              </p>
            </section>
          ))}
        </div>
      </div>
      <section className="border rounded-2xl p-7 mb-5">
        <h2 className="text-2xl mb-3">What “local” means</h2>
        <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <li>
            Your writing is processed on this device. No journal, mood, or chat
            text is sent to a remote AI endpoint.
          </li>
          <li>
            Loading the website still contacts its hosting provider. Enabling AI
            downloads public model files from Hugging Face and the WebLLM model
            library host; those hosts see ordinary connection information, but
            are not sent your conversations.
          </li>
          <li>
            After the production app finishes caching, its core tools can reopen
            offline. AI needs its model and runtime files cached too. Browsers
            may evict cached files, and private browsing may not retain your
            data.
          </li>
          <li>
            Use Settings to export or clear your personal data and remove the
            downloaded model. Exported files are also unencrypted. Clearing
            browser storage removes your saved entries.
          </li>
        </ul>
        <Link href="/settings" className="primary-link mt-5">
          Manage your data →
        </Link>
      </section>
      <section className="border rounded-2xl p-7">
        <h2 className="text-2xl mb-3">Care beyond the screen</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you are in immediate danger or think you might harm yourself or
          someone else, contact local emergency services or go to the nearest
          emergency department. Ask someone you trust to stay with you if you
          can. This app cannot reliably detect a crisis or replace human
          support.
        </p>
        <h3 className="text-lg mt-6 mb-2">Further reading</h3>
        <p className="text-sm text-muted-foreground">
          Our breathing and stress resources draw on general self-care guidance.
          Use a comfortable pace and stop if an exercise feels uncomfortable.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm underline">
          <a
            href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/"
            target="_blank"
            rel="noreferrer"
          >
            NHS: comfortable breathing
          </a>
          <a
            href="https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/"
            target="_blank"
            rel="noreferrer"
          >
            NHS: everyday stress
          </a>
          <a href="https://webllm.mlc.ai/" target="_blank" rel="noreferrer">
            About WebLLM
          </a>
        </div>
      </section>
    </div>
  );
}
