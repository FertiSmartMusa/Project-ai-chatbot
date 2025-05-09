// keywords.ts
export const calendarKeywords = [
  {
    keywords: ["etkinlik ekle", "add event"],
    prompt: (sentence: string) => 
      `If the following sentence contains an event to be added to the calendar, return JSON: {"title": "Event title", "date": "YYYY-MM-DDTHH:mm:ss"}. Sentence: "${sentence}"`,
    action: "add_event"
  },
  {
    keywords: ["etkinlik listesi", "list events"],
    prompt: (sentence: string) =>
    `If the following sentence asks for events on a date, return JSON: {"date": "YYYY-MM-DD"}. or if it asks for events in any month, return JSON: {"month": "YYYY-MM"}. Sentence: "${sentence}"`,
    action: "list_events"
  },
];


export type ChatEvent = {
    title: string;
    date: Date;
  };