# 💡 SIT Assistant - עוזר חשיבה המצאתית שיטתית

אפליקציית ווב אינטראקטיבית המבוססת על בינה מלאכותית (Claude API) שמדריכה אותך בתהליך פתרון בעיות לפי שיטת **SIT - Systematic Inventive Thinking** (חשיבה המצאתית שיטתית).

![SIT Assistant](https://img.shields.io/badge/SIT-Systematic_Inventive_Thinking-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-orange)

---

## 🎯 מה זה?

עוזר חכם שמלווה אותך בתהליך המובנה של SIT לפתרון בעיות והמצאת רעיונות חדשים. האפליקציה כוללת:

- **צ'אט חופשי** - תאר בעיה בשפה חופשית וקבל הדרכה מבוססת SIT
- **תהליך מובנה** - מעבר שלב-אחר-שלב דרך 6 שלבי התהליך
- **העלאת קבצים** - תמיכה בהעלאת מסמכים (PDF) ותמונות לניתוח
- **5 כלי SIT** - הפעלת כלי SIT על הבעיה שלך

### שלבי התהליך
1. **תיאור הבעיה** - ניסוח עובדתי וקצר
2. **העולם הסגור** - מיפוי רכיבי הבעיה והסביבה
3. **שרשרת תל"ר** - בניית שרשרת תופעות לא רצויות
4. **שינוי איכותי** - הגדרת פעולות רצויות
5. **הפעלת כלים** - בחירה והפעלת כלי SIT
6. **פיתוח ותיעוד** - גיבוש הפתרון הסופי

### 5 כלי SIT
| כלי | תיאור |
|-----|--------|
| 🔗 **איחוד משימות** | הקצאת תפקיד חדש לרכיב קיים |
| 📋 **הכפלה** | יצירת עותק שונה של רכיב |
| ✂️ **חלוקה** | פירוק המערכת לחלקים |
| 📊 **הוספת מימד** | יצירת קשרים חדשים בין משתנים |
| 🚫 **הסרה** | הסרת רכיב ופיזור תפקידו |

---

## 🚀 התקנה והפעלה

### דרישות מקדימות
- [Node.js](https://nodejs.org/) (גרסה 18 ומעלה)
- מפתח API של [Anthropic Claude](https://console.anthropic.com/)

### התקנה

```bash
# שכפול הפרויקט
git clone https://github.com/YOUR_USERNAME/sit-assistant.git
cd sit-assistant

# התקנת חבילות
npm install

# הגדרת מפתח API
# צור קובץ .env בתיקיית הפרויקט:
echo ANTHROPIC_API_KEY=your-api-key-here > .env
```

### הפעלה

#### אפשרות 1: קובץ BAT (Windows)
לחץ פעמיים על `start.bat` - הכל יופעל אוטומטית!

#### אפשרות 2: הפעלה ידנית
```bash
# הפעלת שרת Backend (טרמינל 1)
node server.js

# הפעלת שרת Frontend (טרמינל 2)
npm run dev
```

פתח את הדפדפן בכתובת: **http://localhost:5173**

---

## 🏗️ מבנה הפרויקט

```
├── server.js              # שרת Express - proxy ל-Claude API
├── sit-knowledge.js       # בסיס הידע של SIT (system prompt)
├── start.bat              # קובץ הפעלה ל-Windows
├── src/
│   ├── App.jsx            # קומפוננטה ראשית
│   ├── components/
│   │   ├── ChatInterface.jsx    # צ'אט חופשי
│   │   ├── GuidedProcess.jsx    # תהליך מובנה
│   │   ├── MessageBubble.jsx    # בועת הודעה
│   │   ├── FileUpload.jsx       # העלאת קבצים
│   │   ├── StepIndicator.jsx    # מחוון שלבים
│   │   └── ToolSelector.jsx     # בחירת כלי SIT
│   └── utils/
│       └── api.js               # קריאות API
```

---

## ⚙️ טכנולוגיות

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Claude API (Anthropic) עם תמיכה בתמונות
- **עיבוד קבצים**: pdf-parse (PDF), multer (העלאות)

---

## 📝 רישיון

MIT License

---

## 🙏 תודות

מבוסס על שיטת SIT (Systematic Inventive Thinking) שפותחה על ידי חברת SIT.
בסיס הידע נבנה על סמך חומרי לימוד מאוניברסיטת בר-אילן.
