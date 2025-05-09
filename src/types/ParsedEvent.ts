export type ParsedEventAdd = {
    action: "add_event";
    title: string;
    date: Date;
    endDate: Date;
    location: string;
    notes: string;
    url: string;
    allDay: boolean;
  };
  
  export type ParsedEventList = {
    action: "list_events";
    date?: Date;
    month?: string;
  };
  
  export type ParsedEvent = ParsedEventAdd | ParsedEventList;
  