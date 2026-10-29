import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({ needs: z.string().trim().min(10).max(2000) });

const SYSTEM = `You are the insurance guide for A B Taxway Consultancy in India, run by Anilkumarsingh Bhadauria (in the field since 2004).
A prospective client describes their situation. Reply in plain text (no markdown symbols like ** or #), under 350 words, with these sections:
Recommended options: 2-4 relevant insurance types (e.g. term life, health/mediclaim, family floater, critical illness, personal accident, motor, home, business/shop, travel), each with one line on why it fits.
What to prepare: a short list of documents and information to bring (e.g. ID/KYC, age proofs, medical history, existing policies, income details, vehicle RC).
Questions to discuss: 2-3 questions for the consultation.
Do not quote prices, premiums, specific insurers or guarantees. End by suggesting they contact the consultancy to discuss. If the message is not about insurance, politely say you can only help with insurance needs.`;

export const Route = createFileRoute("/api/insurance-advice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Please describe your needs in at least a few words." }, { status: 400 });
        const apiKey = typeof process !== "undefined" && process.env ? process.env["LOVABLE_API_KEY"] : undefined;
        if (!apiKey) return Response.json({ error: "The advisor is not configured yet. Please contact us directly on WhatsApp or phone." }, { status: 500 });
        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              instructions: SYSTEM,
              input: parsed.data.needs,
              stream: true,
              store: false,
              reasoning: { effort: "low", summary: "auto" },
              include: ["reasoning.encrypted_content"],
            }),
          });
          if (!upstream.ok) {
            const msg = upstream.status === 429 ? "The advisor is busy right now. Please try again in a minute."
              : upstream.status === 402 ? "The advisor is temporarily unavailable. Please contact us directly."
              : "The advisor couldn't respond. Please try again later.";
            return Response.json({ error: msg }, { status: upstream.status });
          }
          return new Response(upstream.body, { headers: { "Content-Type": "text/event-stream" } });
        } catch (error) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw error;
        }
      },
    },
  },
});
