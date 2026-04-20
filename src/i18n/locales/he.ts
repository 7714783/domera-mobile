import type { en } from './en';

export const he: typeof en = {
  common: {
    loading: 'טוען…',
    retry: 'נסה שוב',
    cancel: 'ביטול',
    save: 'שמירה',
    empty: 'עדיין אין כאן שום דבר',
    errorGeneric: 'משהו השתבש. נסה שוב.',
    offline: 'אין חיבור. מוצג מידע מהמטמון.',
    unknown: 'לא ידוע',
  },
  auth: {
    loginTitle: 'כניסה ל-Domera',
    email: 'אימייל',
    password: 'סיסמה',
    submit: 'כניסה',
    invalid: 'פרטי כניסה שגויים',
    logout: 'יציאה',
  },
  nav: {
    home: 'בית',
    tasks: 'המשימות שלי',
    scanner: 'סריקה',
    notifications: 'התראות',
    profile: 'פרופיל',
    settings: 'הגדרות',
    buildings: 'בניינים',
  },
  tasks: {
    title: 'המשימות שלי',
    emptyTitle: 'אין משימות מוקצות',
    emptyBody: 'כאשר מנהל יקצה לך משימה, היא תופיע כאן.',
    transitionTo: 'העבר ל',
    addComment: 'הוסף תגובה',
    attachPhoto: 'צרף תמונה',
  },
  scanner: {
    title: 'סריקת QR',
    instruction: 'כוון את המצלמה לקוד QR על ציוד, שלט חדר או הזמנת עבודה.',
    permissionDenied: 'הגישה למצלמה נדחתה. הפעל בהגדרות המערכת.',
    permissionRequest: 'אפשר גישה למצלמה',
    unknownCode: 'הקוד לא זוהה. נסה קוד אחר.',
    rescan: 'סרוק שוב',
  },
  notifications: {
    title: 'התראות',
    empty: 'אין התראות עדיין.',
    permissionRequest: 'הפעל התראות דחיפה',
    permissionDenied: 'ההתראות כבויות. הפעל בהגדרות המערכת.',
  },
  access: {
    noAccess: 'הגישה מוגבלת',
    noAccessBody: 'אין לך הרשאה לצפות במסך זה.',
  },
};
