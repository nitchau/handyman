import { Camera, Search, Hammer } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: <Camera className="size-6" />,
    title: "Plan",
    description: "Upload photos, AI tells you what you need",
  },
  {
    number: "2",
    icon: <Search className="size-6" />,
    title: "Source",
    description: "AI compares prices across stores, find tool rentals nearby",
  },
  {
    number: "3",
    icon: <Hammer className="size-6" />,
    title: "Build",
    description: "DIY with AI help, or hire a pro for the hard parts",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-800">
          How It Works
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line (desktop only, between steps) */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-7 hidden h-px w-[calc(100%-80px)] border-t-2 border-dashed border-emerald-300 md:block" />
              )}

              {/* Step circle */}
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-white">
                {step.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
