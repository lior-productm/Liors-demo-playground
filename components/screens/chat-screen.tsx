"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  Copy,
  Building2,
  ArrowUpRight,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
  dataCard?: {
    title: string;
    items: { label: string; value: string; change?: string }[];
  };
  generatedFile?: {
    name: string;
    description: string;
  };
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'm connected to your organization's Amiio database. I can analyze your real estate portfolio data, explain trends, run comparisons, generate financial files, and help you make data-driven decisions. What would you like to explore?",
    timestamp: "10:32 AM",
    suggestions: [
      "Why is retail underperforming?",
      "Analyze tenant growth trends",
      "Generate budget revision for Tower One",
      "Show me high-risk assets",
    ],
  },
];

const simulatedResponses: Record<string, Message> = {
  "Why is retail underperforming?": {
    id: "retail-response",
    role: "assistant",
    content:
      "Based on your portfolio data, the retail segment is underperforming by -8.6% on average across 3 assets. Here's the breakdown:\n\n**Root Causes:**\n1. **Central Mall** (-11.0%): Lost anchor tenant Zara in Q2, reducing footfall by 22%. Two additional tenants have activated break clauses.\n2. **Harbor Retail** (-7.1%): Occupancy at 82.1%, the lowest in portfolio. Competition from new mall opened 3km away in Q1.\n3. **City Center Mall** (-7.8%): Ongoing construction on adjacent road reducing accessibility. Expected to resolve by Q4.\n\n**Recommendation:** Consider consolidating property management across all three retail assets. A unified tenant mix strategy could improve occupancy by 3-5%.",
    timestamp: "10:33 AM",
    dataCard: {
      title: "Retail Segment Overview",
      items: [
        { label: "Avg. NOI Variance", value: "-8.6%", change: "-8.6%" },
        { label: "Avg. Occupancy", value: "84.6%", change: "-3.2%" },
        { label: "Combined NOI Gap", value: "-$570K" },
        { label: "At-Risk Leases", value: "7 units" },
      ],
    },
    suggestions: [
      "Generate a retail strategy report",
      "Show me comparable retail portfolios",
      "Draft a tenant retention strategy",
    ],
  },
  "Analyze tenant growth trends": {
    id: "tenant-response",
    role: "assistant",
    content:
      "I've analyzed tenant growth across your portfolio using Amiio's historical database (2024-2026):\n\n**Key Findings:**\n1. **Tower One Office**: Tenant count grew from 13 to 18 (+40%). This is significant because your operating budget was set in 2024 and doesn't reflect the increased CAM revenue, insurance recoveries, and utility reimbursements from these 5 additional tenants. Estimated missed budget: **+$185K NOI**.\n\n2. **Mega Logistics Hub**: Although tenant count is stable at 7, inquiry volume from Amiio CRM is up 3x. Current rates are 12% below Lod corridor market comps - there's a rent renegotiation window.\n\n3. **Prestige Residences**: Herzliya Pituach residential demand up 15% over 2 years. With only 3 vacant units, a proactive renewal campaign at +5% escalation could add **$205K/year**.\n\n**Total Opportunity from Tenant Trends: +$670K/year**",
    timestamp: "10:33 AM",
    dataCard: {
      title: "Tenant Growth Analysis (2Y)",
      items: [
        { label: "Tower One Growth", value: "+40%", change: "+5 tenants" },
        { label: "Logistics Demand", value: "3x", change: "inquiries" },
        { label: "Prestige Demand", value: "+15%", change: "market" },
        { label: "Revenue Potential", value: "+$670K/yr" },
      ],
    },
    suggestions: [
      "Generate budget revision for Tower One",
      "Create rent renegotiation analysis",
      "Draft renewal proposals for Prestige",
    ],
  },
  "Generate budget revision for Tower One": {
    id: "generate-response",
    role: "assistant",
    content:
      "I've prepared a budget revision for Tower One Office based on the tenant count increase from 13 to 18 tenants since 2024. Here's what the revised budget includes:\n\n**Adjustments Made:**\n- **CAM Revenue**: +$95K (5 additional tenants contributing to common area maintenance)\n- **Insurance Recovery**: +$42K (higher recovery from larger tenant base)\n- **Utility Reimbursements**: +$38K (shared utility costs spread across more tenants)\n- **Management Fee Adjustment**: +$10K (scaled management fee per tenant)\n\n**Total NOI Adjustment: +$185K**\n\nThe file is ready for download. It includes a revised budget model, tenant roll comparison (2024 vs 2026), and sensitivity analysis.",
    timestamp: "10:34 AM",
    dataCard: {
      title: "Budget Revision Summary",
      items: [
        { label: "CAM Revenue", value: "+$95K" },
        { label: "Insurance Recovery", value: "+$42K" },
        { label: "Utility Reimburse", value: "+$38K" },
        { label: "Total NOI Impact", value: "+$185K" },
      ],
    },
    generatedFile: {
      name: "Tower_One_Budget_Revision_2026.xlsx",
      description: "Budget revision with tenant roll changes, CAM adjustments, and sensitivity analysis",
    },
    suggestions: [
      "Apply this to the portfolio budget",
      "Show me the sensitivity analysis",
      "Generate similar report for all assets",
    ],
  },
  "Show me high-risk assets": {
    id: "risk-response",
    role: "assistant",
    content:
      "I've identified 4 assets with elevated risk profiles based on multiple factors from your Amiio database:\n\n**High Risk:**\n1. **Harbor Retail Center** - Risk Score: 8.2/10\n   - Lowest occupancy (82.1%), high debt (67%), short WAULT (2.8yr)\n2. **Central Mall** - Risk Score: 7.5/10\n   - Large NOI gap (-11%), declining occupancy trend\n\n**Medium Risk:**\n3. **Skyline Apartments** - Risk Score: 5.8/10\n   - Highest debt ratio (73%), vulnerable to rate increases\n4. **Residence Heights** - Risk Score: 5.4/10\n   - High leverage (71%) with short WAULT (2.1yr)\n\nThe retail assets present the most immediate concern. I recommend prioritizing Harbor Retail Center for intervention.",
    timestamp: "10:34 AM",
    dataCard: {
      title: "Risk Assessment",
      items: [
        { label: "High Risk Assets", value: "2" },
        { label: "Medium Risk Assets", value: "2" },
        { label: "Total Value at Risk", value: "$171M" },
        { label: "Avg. Risk Score", value: "6.7/10" },
      ],
    },
    suggestions: [
      "Generate a risk mitigation plan",
      "What's our covenant status?",
      "Create risk report for board",
    ],
  },
};

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = simulatedResponses[messageText];
      if (response) {
        setMessages((prev) => [
          ...prev,
          { ...response, id: `resp-${Date.now()}` },
        ]);
      } else {
        // Check if it's a generate request
        const isGenerateRequest = messageText.toLowerCase().includes("generate") || messageText.toLowerCase().includes("create") || messageText.toLowerCase().includes("report");
        setMessages((prev) => [
          ...prev,
          {
            id: `resp-${Date.now()}`,
            role: "assistant",
            content: isGenerateRequest
              ? `I've analyzed your request "${messageText}" against your organization's Amiio database and prepared a comprehensive file. The report includes data from all 12 assets, historical trends from the past 24 months, and AI-generated commentary on key findings.`
              : `I've analyzed your query "${messageText}" against your organization's database. Based on your portfolio of 12 assets across Israel, I can see several relevant data points. Would you like me to dive deeper into any specific asset or segment?`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            generatedFile: isGenerateRequest
              ? {
                  name: `Custom_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
                  description: "AI-generated report based on your custom request",
                }
              : undefined,
            suggestions: isGenerateRequest
              ? [
                  "Open in Excel",
                  "Generate a follow-up analysis",
                  "Share with team",
                ]
              : [
                  "Show full asset details",
                  "Generate a report",
                  "Compare with market data",
                ],
          },
        ]);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-3 w-3 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Amiio AI</p>
          <p className="text-[10px] text-muted-foreground">
            Connected to your organization database
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent animate-ai-pulse" />
          <span className="text-[10px] font-medium text-accent">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3"
      >
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2.5 animate-fade-in-up",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                  message.role === "assistant"
                    ? "bg-primary"
                    : "bg-secondary"
                )}
              >
                {message.role === "assistant" ? (
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                ) : (
                  <User className="h-3 w-3 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "max-w-[85%] min-w-0",
                  message.role === "user" && "text-right"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-[11px] leading-relaxed",
                    message.role === "assistant"
                      ? "bg-card border border-border text-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.content.split("\n").map((line, i) => (
                    <span key={`${message.id}-line-${i}`} className="block">
                      {line.startsWith("**") && line.endsWith("**") ? (
                        <strong>{line.replace(/\*\*/g, "")}</strong>
                      ) : line.includes("**") ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line.replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      ) : (
                        line || <br />
                      )}
                    </span>
                  ))}
                </div>

                {/* Data Card */}
                {message.dataCard && (
                  <div className="mt-2 rounded-lg border border-border bg-card p-2.5">
                    <p className="mb-1.5 text-[10px] font-semibold text-foreground">
                      {message.dataCard.title}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {message.dataCard.items.map((item) => (
                        <div
                          key={item.label}
                          className="rounded bg-secondary/50 px-2 py-1"
                        >
                          <p className="text-[9px] text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="text-[11px] font-bold text-foreground">
                            {item.value}
                          </p>
                          {item.change && (
                            <p className={cn(
                              "text-[9px] font-medium",
                              item.change.startsWith("-") ? "text-destructive" : "text-accent"
                            )}>
                              {item.change}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated File */}
                {message.generatedFile && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 p-2.5">
                    <FileSpreadsheet className="h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-foreground">
                        {message.generatedFile.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {message.generatedFile.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground hover:bg-accent/90"
                    >
                      <Download className="h-3 w-3" />
                      Open
                    </button>
                  </div>
                )}

                {/* Timestamp + Actions */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground">
                    {message.timestamp}
                  </span>
                  {message.role === "assistant" && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSend(suggestion)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                          suggestion.toLowerCase().includes("generate") || suggestion.toLowerCase().includes("create") || suggestion.toLowerCase().includes("draft")
                            ? "border-accent/20 bg-accent/5 text-accent hover:bg-accent/10"
                            : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                        )}
                      >
                        {(suggestion.toLowerCase().includes("generate") || suggestion.toLowerCase().includes("create") || suggestion.toLowerCase().includes("draft")) && (
                          <FileSpreadsheet className="mr-1 inline h-3 w-3" />
                        )}
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary typing-dot-1" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary typing-dot-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary typing-dot-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="border-t border-border bg-card px-3 py-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {[
            { icon: Building2, label: "Asset Detail" },
            { icon: ArrowUpRight, label: "Performance" },
            { icon: AlertTriangle, label: "Risk Report" },
            { icon: Users, label: "Tenant Trends" },
            { icon: FileSpreadsheet, label: "Generate File" },
          ].map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() =>
                  handleSend(
                    chip.label === "Generate File"
                      ? "Generate a comprehensive portfolio report"
                      : chip.label === "Tenant Trends"
                        ? "Analyze tenant growth trends"
                        : `Show me ${chip.label.toLowerCase()}`
                  )
                }
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] transition-colors",
                  chip.label === "Generate File"
                    ? "border-accent/20 bg-accent/5 text-accent hover:bg-accent/10"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio or request a file..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              input.trim() && !isTyping
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
          Amiio AI has access to your organization{"'"}s complete dataset
        </p>
      </div>
    </div>
  );
}
