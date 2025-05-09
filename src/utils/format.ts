// utils/format.ts
export function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  export function formatDateTimeFromId(timestampStr: string): string {
    try {
      // 2025-04-23T14-25-00 -> 2025-04-23T14:25:00
      const corrected = timestampStr.replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');
      const date = new Date(corrected);
  
      if (isNaN(date.getTime())) return 'Invalid Date';
  
      return date.toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  }
  
  