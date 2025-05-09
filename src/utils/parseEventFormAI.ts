// utils/AIparsEventForm.ts
import { ParsedEvent } from "../types/ParsedEvent";


export function parseEventFromAIResponse(reply: string): ParsedEvent | null {
  try {
    const cleaned = reply.trim().replace(/```json|```/g, "");
    const parsed = JSON.parse(cleaned);

    if (!parsed || typeof parsed !== "object") return null;

    const action = parsed.action || (parsed.title ? "add_event" : "list_events");

    if (action === "add_event") {
      return {
        action: "add_event",
        title: parsed.title || "Untitled Event",
        date: parsed.date ? new Date(parsed.date) : new Date(),
        endDate: parsed.endDate ? new Date(parsed.endDate) : new Date(new Date(parsed.date || Date.now()).getTime() + 60 * 60 * 1000),
        location: parsed.location || "No Location",
        notes: parsed.notes || "No Notes",
        url: parsed.url || "",
        allDay: parsed.allDay ?? false,
      };
    } else if (action === "list_events") {
      return {
        action: "list_events",
        date: parsed.date ? new Date(parsed.date) : undefined,
        month: parsed.month || undefined,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Parsing error:", error);
    return null;
  }
}
