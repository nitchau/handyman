"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Phone, Video, Send, ImagePlus, PlusCircle, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatConversations, chatMessages, activeChatProject } from "@/data/contractor-data";

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(chatConversations[0].id);
  const [messageText, setMessageText] = useState("");

  const activeConversation = chatConversations.find((c) => c.id === activeConv) ?? chatConversations[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Left panel: conversation list */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r bg-white md:w-[320px]">
        {/* Search */}
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full rounded-xl border-none bg-slate-100 py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {chatConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={cn(
                "group relative flex cursor-pointer items-center gap-3 border-l-4 p-4 transition-colors",
                activeConv === conv.id
                  ? "border-primary bg-emerald-50/30"
                  : "border-transparent hover:bg-slate-50"
              )}
            >
              <div className="relative shrink-0">
                <Image
                  src={conv.avatar_url}
                  alt={conv.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full border object-cover"
                />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{conv.name}</h3>
                  <span className={cn("text-xs", activeConv === conv.id ? "font-medium text-primary" : "text-slate-400")}>
                    {conv.timestamp}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500">{conv.last_message}</p>
              </div>
              {conv.unread > 0 && (
                <div className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Center panel: chat */}
      <section className="flex flex-1 flex-col bg-slate-50/50">
        {/* Chat header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={activeConversation.avatar_url}
                alt={activeConversation.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              {activeConversation.online && (
                <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 md:text-base">{activeConversation.name}</h2>
                {activeConversation.badge && (
                  <span className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {activeConversation.badge}
                  </span>
                )}
              </div>
              {activeConversation.online && <p className="text-xs font-medium text-green-600">Online now</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
              <Phone className="size-5" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
              <Video className="size-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Timestamp separator */}
          <div className="flex justify-center">
            <span className="rounded-full bg-slate-200/50 px-3 py-1 text-xs font-medium text-slate-400">Today, 10:23 AM</span>
          </div>

          {chatMessages.map((msg) =>
            msg.sender === "contractor" ? (
              <div key={msg.id} className="flex max-w-3xl gap-4">
                <Image
                  src={activeConversation.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  className="mb-1 size-8 self-end rounded-full object-cover"
                />
                <div className="flex flex-col items-start gap-1">
                  <div className="rounded-2xl rounded-bl-none border bg-white p-4 shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  {/* Quote card */}
                  {msg.quote && (
                    <div className="mt-2 w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-md">
                      <div className="flex items-center justify-between border-b bg-slate-50/50 p-4">
                        <div className="flex items-center gap-2 font-bold text-primary">
                          <span className="text-sm uppercase tracking-wide">Quote Received</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">#{msg.quote.id}</span>
                      </div>
                      <div className="p-5">
                        <div className="mb-4 flex gap-4">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image src={msg.quote.image_url} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{msg.quote.title}</h4>
                            <p className="mt-1 text-sm text-slate-500">{msg.quote.description}</p>
                          </div>
                        </div>
                        <div className="mb-6 flex items-baseline justify-between">
                          <span className="text-sm font-medium text-slate-500">Total Estimate</span>
                          <span className="text-2xl font-bold text-slate-900">${msg.quote.amount.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="w-full">
                            Decline
                          </Button>
                          <Button className="w-full">Accept Quote</Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <span className="ml-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="ml-auto flex max-w-3xl flex-row-reverse gap-4">
                <div className="flex flex-col items-end gap-1">
                  <div className="rounded-2xl rounded-br-none bg-primary p-4 text-white shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.image_url && (
                    <div className="relative mt-1 h-auto w-64 overflow-hidden rounded-xl border-2 border-primary/20">
                      <Image src={msg.image_url} alt="Attachment" width={256} height={192} className="object-cover" />
                    </div>
                  )}
                  <span className="mr-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t bg-white p-4">
          <div className="mx-auto flex max-w-4xl items-end gap-3">
            <button className="shrink-0 rounded-full p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary">
              <PlusCircle className="size-5" />
            </button>
            <button className="shrink-0 rounded-full p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary">
              <ImagePlus className="size-5" />
            </button>
            <div className="flex-1 rounded-xl bg-slate-100 p-2 transition-shadow focus-within:ring-2 focus-within:ring-primary/50">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="h-10 max-h-32 w-full resize-none border-none bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0"
                placeholder="Type a message..."
                rows={1}
              />
            </div>
            <button className="shrink-0 rounded-xl bg-primary p-3 text-white shadow-md transition-all hover:bg-emerald-700">
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Right panel: context sidebar */}
      <aside className="hidden w-[300px] shrink-0 flex-col overflow-y-auto border-l bg-white xl:flex">
        {/* Project summary */}
        <div className="border-b p-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Current Project</h3>
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                \uD83D\uDD27
              </div>
              <span className="rounded-md border border-yellow-200 bg-yellow-100 px-2 py-1 text-[10px] font-bold uppercase text-yellow-700">
                {activeChatProject.status}
              </span>
            </div>
            <h4 className="mb-1 font-bold text-slate-900">{activeChatProject.title}</h4>
            <p className="mb-3 text-xs text-slate-500">Service Request {activeChatProject.service_request_id}</p>
            <div className="text-lg font-bold text-primary">${activeChatProject.amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Contractor profile */}
        <div className="border-b p-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">About the Pro</h3>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={activeConversation.avatar_url}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{activeConversation.name}</h4>
              <a href="#" className="text-xs text-primary hover:underline">
                View Profile
              </a>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-slate-50 p-3 text-center">
              <div className="mb-1 flex items-center justify-center gap-1 text-yellow-500">
                <Star className="size-4 fill-yellow-500" />
                <span className="font-bold text-slate-900">4.9</span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Rating</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3 text-center">
              <div className="mb-1 font-bold text-slate-900">124</div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Jobs Done</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="size-4 text-slate-400" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Shared photos */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Photos</h3>
            <a href="#" className="text-xs font-medium text-primary hover:underline">
              See all
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-opacity hover:opacity-90">
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <ImagePlus className="size-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
