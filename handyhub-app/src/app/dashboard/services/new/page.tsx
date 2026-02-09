"use client";

import { useState } from "react";
import {
  Palette,
  Video,
  ShoppingCart,
  Home,
  Paintbrush,
  Grid3x3,
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  ClipboardList,
  Monitor,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ServiceType, PriceType } from "@/types/database";
import { serviceTemplates } from "@/data/gallery-data";
import type { ServiceTemplate } from "@/types/database";

function formatLabel(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const SERVICE_TYPE_ICONS: Record<string, React.ElementType> = {
  [ServiceType.MOOD_BOARD]: Palette,
  [ServiceType.CONSULTATION]: Video,
  [ServiceType.SHOPPING_LIST]: ShoppingCart,
  [ServiceType.FULL_ROOM_REDESIGN]: Home,
  [ServiceType.COLOR_CONSULTATION]: Paintbrush,
  [ServiceType.SPACE_PLANNING]: Grid3x3,
  [ServiceType.CUSTOM]: Sparkles,
  [ServiceType.ROOM_DESIGN]: Home,
  [ServiceType.STYLING_SESSION]: Sparkles,
};

const STEPS = [
  { num: 1, label: "Choose Template" },
  { num: 2, label: "Customize & Publish" },
];

export default function NewServicePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.CUSTOM);
  const [price, setPrice] = useState(0);
  const [priceType, setPriceType] = useState<PriceType>(PriceType.FIXED);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [maxRevisions, setMaxRevisions] = useState(1);
  const [isVirtual, setIsVirtual] = useState(true);
  const [includesShoppingList, setIncludesShoppingList] = useState(false);
  const [includesBom, setIncludesBom] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  function selectTemplate(template: ServiceTemplate | null) {
    setSelectedTemplate(template);
    if (template) {
      setTitle(template.title);
      setDescription(template.description);
      setServiceType(template.service_type);
      setPrice(template.price_min);
      setPriceType(template.price_type);
      setDeliveryDays(template.estimated_delivery_days);
      setMaxRevisions(template.max_revisions);
      setIsVirtual(template.is_virtual);
      setIncludesShoppingList(template.includes_shopping_list);
      setIncludesBom(template.includes_bom);
    } else {
      setTitle("");
      setDescription("");
      setServiceType(ServiceType.CUSTOM);
      setPrice(0);
      setPriceType(PriceType.FIXED);
      setDeliveryDays(7);
      setMaxRevisions(1);
      setIsVirtual(true);
      setIncludesShoppingList(false);
      setIncludesBom(false);
    }
    setStep(2);
  }

  function handlePublish() {
    const service = {
      id: crypto.randomUUID(),
      designer_id: "current_user",
      service_type: serviceType,
      title,
      description,
      price,
      price_type: priceType,
      estimated_delivery_days: deliveryDays,
      max_revisions: maxRevisions,
      is_virtual: isVirtual,
      includes_shopping_list: includesShoppingList,
      includes_bom: includesBom,
      is_active: true,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log("Published service:", service);
    setSubmitted(true);
  }

  function resetWizard() {
    setStep(1);
    setSelectedTemplate(null);
    setTitle("");
    setDescription("");
    setServiceType(ServiceType.CUSTOM);
    setPrice(0);
    setPriceType(PriceType.FIXED);
    setDeliveryDays(7);
    setMaxRevisions(1);
    setIsVirtual(true);
    setIncludesShoppingList(false);
    setIncludesBom(false);
    setSubmitted(false);
  }

  // ── Success State ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center py-24">
        <Card>
          <CardContent className="flex flex-col items-center p-10 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-8 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Service Published!</h2>
            <p className="mb-1 text-sm text-slate-500">Your service is now live and visible to clients.</p>
            <p className="mb-6 text-sm font-medium text-slate-700">{title}</p>
            <div className="mb-6 w-full space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-900">{formatLabel(serviceType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-900">${price} ({formatLabel(priceType)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="font-medium text-slate-900">{deliveryDays === 0 ? "Same day" : `${deliveryDays} days`}</span>
              </div>
            </div>
            <Button onClick={resetWizard}>Create Another Service</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Create a New Service</h2>
        <p className="mt-1 text-slate-500">Choose a template to get started, or build from scratch.</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                step >= s.num ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              )}
            >
              {step > s.num ? <Check className="size-4" /> : s.num}
            </div>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                step >= s.num ? "text-slate-900" : "text-slate-400"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Template */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceTemplates.map((template, i) => {
            const Icon = SERVICE_TYPE_ICONS[template.service_type] ?? Sparkles;
            return (
              <button
                key={i}
                onClick={() => selectTemplate(template)}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {formatLabel(template.service_type)}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover:text-primary">
                  {template.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs text-slate-500">{template.description}</p>
                <div className="mt-auto space-y-1.5">
                  <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {template.audience}
                  </span>
                  <p className="text-xs font-medium text-slate-700">
                    ${template.price_min}&ndash;${template.price_max}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {template.estimated_delivery_days > 0 && (
                      <span>{template.estimated_delivery_days}d delivery</span>
                    )}
                    {template.estimated_delivery_days === 0 && <span>Same day</span>}
                    {template.max_revisions > 0 && (
                      <span>{template.max_revisions} rev</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {template.includes_shopping_list && (
                      <ShoppingCart className="size-3.5 text-emerald-500" />
                    )}
                    {template.includes_bom && (
                      <ClipboardList className="size-3.5 text-amber-500" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Start from Scratch */}
          <button
            onClick={() => selectTemplate(null)}
            className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary">
              <Plus className="size-6" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-700 group-hover:text-primary">
              Start from Scratch
            </h3>
            <p className="text-xs text-slate-400">Build a fully custom service</p>
          </button>
        </div>
      )}

      {/* Step 2: Customize & Publish */}
      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="space-y-6 p-6">
                {/* Title */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Service Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Custom Room Mood Board"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what clients will receive..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Service Type + Price Type */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                    >
                      {Object.values(ServiceType).map((st) => (
                        <option key={st} value={st}>{formatLabel(st)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Price Type</label>
                    <select
                      value={priceType}
                      onChange={(e) => setPriceType(e.target.value as PriceType)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                    >
                      {Object.values(PriceType).map((pt) => (
                        <option key={pt} value={pt}>{formatLabel(pt)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  {selectedTemplate && (
                    <p className="mt-1 text-xs text-slate-400">
                      Suggested range: ${selectedTemplate.price_min}&ndash;${selectedTemplate.price_max}
                    </p>
                  )}
                </div>

                {/* Delivery Days + Max Revisions */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Days</label>
                    <input
                      type="number"
                      min={0}
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Max Revisions</label>
                    <input
                      type="number"
                      min={0}
                      value={maxRevisions}
                      onChange={(e) => setMaxRevisions(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-900">Virtual Service</span>
                      <p className="text-xs text-slate-500">Delivered remotely (no in-person visit)</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-900">Includes Shopping List</span>
                      <p className="text-xs text-slate-500">Product links and recommendations</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={includesShoppingList} onChange={(e) => setIncludesShoppingList(e.target.checked)} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-900">Includes Bill of Materials</span>
                      <p className="text-xs text-slate-500">Detailed material list with quantities</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={includesBom} onChange={(e) => setIncludesBom(e.target.checked)} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex justify-between border-t pt-6">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 size-4" /> Back
                  </Button>
                  <Button onClick={handlePublish}>
                    Publish Service <Check className="ml-2 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right — Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-400">Live Preview</p>

                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    {title || "Untitled Service"}
                  </h3>

                  <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {formatLabel(serviceType)}
                  </span>

                  <p className="mb-4 text-sm text-slate-500 line-clamp-3">
                    {description || "No description yet..."}
                  </p>

                  <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Price</span>
                      <span className="text-lg font-bold text-slate-900">
                        ${price}
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          {priceType === PriceType.FIXED && "fixed"}
                          {priceType === PriceType.HOURLY && "/ hr"}
                          {priceType === PriceType.PER_ROOM && "/ room"}
                          {priceType === PriceType.CUSTOM_QUOTE && "quote"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Delivery</span>
                      <span className="font-medium text-slate-700">
                        {deliveryDays === 0 ? "Same day" : `${deliveryDays} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Revisions</span>
                      <span className="font-medium text-slate-700">
                        {maxRevisions === 0 ? "None" : `Up to ${maxRevisions}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Format</span>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        {isVirtual ? (
                          <><Monitor className="size-3.5" /> Virtual</>
                        ) : (
                          <><MapPin className="size-3.5" /> In-Person</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Feature badges */}
                  {(includesShoppingList || includesBom) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {includesShoppingList && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <ShoppingBag className="size-3" /> Shopping List
                        </span>
                      )}
                      {includesBom && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <ClipboardList className="size-3" /> Bill of Materials
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-center text-xs text-slate-400">
                    This is how clients will see your service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
