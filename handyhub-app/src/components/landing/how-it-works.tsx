import {
  Lightbulb,
  PenLine,
  ClipboardList,
  ShoppingCart,
  Hammer,
} from "lucide-react";

const steps = [
  {
    icon: <Lightbulb className="size-5" />,
    title: "Ideate",
    description: "Browse styles and gather inspiration for your project.",
    active: true,
  },
  {
    icon: <PenLine className="size-5" />,
    title: "Design",
    description: "Visualize your dream space with AI-powered tools.",
  },
  {
    icon: <ClipboardList className="size-5" />,
    title: "Plan",
    description: "Create budgets, timelines, and material lists.",
  },
  {
    icon: <ShoppingCart className="size-5" />,
    title: "Source",
    description: "Compare prices and find local suppliers.",
  },
  {
    icon: <Hammer className="size-5" />,
    title: "Build",
    description: "DIY with guides or hire a verified pro.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          How It Works
        </h2>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-0 right-0 top-6 -z-0 hidden h-0.5 bg-slate-100 md:block" />

          <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-5">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${
                    step.active
                      ? "border-2 border-primary bg-emerald-50 text-primary"
                      : "border-2 border-emerald-100 bg-white text-slate-400 group-hover:border-primary group-hover:text-primary"
                  }`}
                >
                  {step.icon}
                </div>
                <h4 className="mb-2 text-lg font-bold text-slate-900">
                  {i + 1}. {step.title}
                </h4>
                <p className="max-w-[180px] text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
