# StudyMate AI

Оюутанд хичээлээ төлөвлөх, даалгаврын хугацаа хянах, шалгалтад бэлтгэх, давтлага хийхэд туслах **Android** апп.
Мобайл програмчлалын Project Challenge-ийн хүрээнд хийв.

## Ашигласан технологи

| Технологи | Зориулалт |
|---|---|
| React Native + Expo | Android апп |
| TypeScript | Төрөл тодорхойлох, алдааг эрт илрүүлэх |
| Expo Router | Дэлгэц хоорондын navigation (file-based) |
| AsyncStorage | Өгөгдлийг утсан дээр хадгалах (одоогийн хувилбар) |
| Supabase | PostgreSQL schema + RLS бэлтгэсэн (`supabase/schema.sql`), дараагийн шатанд холбоно |
| Mock service | AI хариулт (`services/aiService.ts`), quiz өгөгдөл (`data/quizzes.ts`) |

## Суулгах, ажиллуулах

Шаардлага: Node.js 20+, утсанд **Expo Go** апп.

```bash
cd studymate-ai
npm install expo@latest
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react react-native @react-native-async-storage/async-storage @supabase/supabase-js react-native-url-polyfill @expo/vector-icons
npm install -D typescript @types/react
npx expo start
```

Дэлгэцэнд гарсан QR кодыг утасны Expo Go-оор уншуулна (компьютер, утас нэг Wi-Fi-д байна).
Сүлжээ таарахгүй бол `npx expo start --tunnel`.

## Функцууд (FR)

| Код | Модуль | Хэрэгжүүлэлт |
|---|---|---|
| FR-01 | Нүүр | Өнөөдрийн даалгавар, ойртож буй шалгалт, нийт гүйцэтгэл, хурдан үйлдлүүд |
| FR-02 | Хичээл | Нэмэх, харах, засах, устгах (нэр давхардал шалгана) |
| FR-03 | Төлөвлөгч | Даалгавар нэмэх/засах/устгах, хугацаа, ач холбогдол, дууссан төлөв, шүүлтүүр |
| FR-04 | AI Tutor | Чат, 3 горим (хураангуй/тайлбар/давтлага), **mock** хариулт гэдгийг тодорхой харуулна |
| FR-05 | Quiz | Асуулт, сонголт, явцын мөр, зөв/буруу тайлбар, оноо, үр дүн, хариултын тойм |
| FR-06 | Ахиц | Гүйцэтгэл, quiz дундаж/шилдэг, суралцсан минут, хичээл тус бүрийн ахиц |
| FR-07 | Профайл | Нэр, имэйл, өдрийн зорилго, тохиргоо, demo сэргээх |

**Бонус:** Pomodoro фокус таймер (study_sessions-д бүртгэнэ), өдөр тутмын зорилго, streak.

## Бүтэц

```
app/
  _layout.tsx          Root Stack + AppProvider
  (tabs)/              5 үндсэн таб: index, planner, tutor, quiz, progress
  task-form.tsx        Даалгавар нэмэх/засах (modal)
  subjects.tsx         Хичээлийн удирдлага
  focus.tsx            Pomodoro таймер (бонус)
components/            Дахин ашиглах UI (Card, AppButton, Chip, Field, TaskRow …)
context/AppContext.tsx Төлөвийн удирдлага + AsyncStorage
services/aiService.ts  AIService интерфейс + MockAIService
data/                  Demo болон quiz өгөгдөл
lib/supabase.ts        Supabase client (бэлтгэл)
supabase/schema.sql    Хүснэгт, RLS, trigger
```

## AI-г бодит API-аар солих

`AIService` интерфейсийг хэрэгжүүлсэн шинэ класс бичээд `services/aiService.ts` доторх `aiService`-ийг солино.
Дэлгэцийн код өөрчлөгдөхгүй. API түлхүүрийг аппын кодонд бичихгүй, backend (Supabase Edge Function) дамжуулна.

## Цаашдын сайжруулалт

- Supabase Auth + өгөгдлийг cloud-д синк хийх
- Бодит AI API (Edge Function-оор)
- Push notification: хугацаа ойртоход сануулах
- Quiz-ийг хичээлийн материалаас автоматаар үүсгэх
