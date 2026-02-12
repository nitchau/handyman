"use client";

import { useEffect, useRef } from "react";
import { Wrench } from "lucide-react";
import { useChatStore, type ChatMessage } from "@/stores/chat-store";

export function ChatMessages() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <Wrench className="size-6 text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">
          Hi, I&apos;m Handy!
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Your home improvement assistant. Ask me about DIY projects, design
          ideas, when to hire a pro, or how to use HandyHub.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLastModel={
              isStreaming &&
              msg.role === "model" &&
              msg.id === messages[messages.length - 1]?.id
            }
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  message,
  isLastModel,
}: {
  message: ChatMessage;
  isLastModel: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-slate-100 text-slate-800"
            : "bg-emerald-50 text-slate-800"
        }`}
      >
        <span className="whitespace-pre-wrap break-words">{message.content}</span>
        {isLastModel && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-emerald-500" />
        )}
      </div>
    </div>
  );
}
