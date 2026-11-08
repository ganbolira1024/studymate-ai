import type { AIMode } from '../types';

/**
 * AI туслахын интерфейс. Одоо MockAIService ашиглаж байгаа.
 * Бодит API холбохдоо энэ интерфейсийг хэрэгжүүлсэн шинэ класс бичээд
 * доорх `aiService`-ийг солиход хангалттай — дэлгэцийн кодыг өөрчлөх шаардлагагүй.
 */
export interface AIService {
  readonly isMock: boolean;
  ask(question: string, mode: AIMode): Promise<string>;
}

export const modeLabels: Record<AIMode, string> = {
  summary: 'Хураангуй',
  explain: 'Тайлбар',
  review: 'Давтлага',
};

type Topic = { keys: string[]; summary: string; explain: string; review: string };

const topics: Topic[] = [
  {
    keys: ['react', 'component', 'компонент', 'state', 'hook', 'expo'],
    summary: '• React Native нь JavaScript/TypeScript-ээр mobile апп бичих framework.\n• UI нь component-уудаас бүтнэ.\n• Өгөгдөл props-оор дамжиж, state-ээр өөрчлөгдөнө.',
    explain: 'Component бол UI-ийн дахин ашиглах боломжтой хэсэг. Жишээ нь TaskRow component нэг даалгаврыг харуулдаг бөгөөд жагсаалт дахь бүх даалгаварт дахин ашиглагдана. useState-ээр утга өөрчлөгдөхөд React тухайн хэсгийг автоматаар дахин зурна.',
    review: '1) Props ба state-ийн ялгааг өөрийн үгээр бич.\n2) FlatList ашиглан 3 мөртэй жагсаалт хий.\n3) useEffect хэзээ ажилладгийг тайлбарла.',
  },
  {
    keys: ['sql', 'database', 'өгөгдлийн сан', 'хүснэгт', 'join', 'select', 'key'],
    summary: '• Өгөгдлийн сан нь хүснэгтүүдээс бүрдэнэ.\n• Primary key мөр бүрийг ялгана, foreign key хүснэгтүүдийг холбоно.\n• SELECT, INSERT, UPDATE, DELETE нь үндсэн командууд.',
    explain: 'JOIN нь хоёр хүснэгтийг нийтлэг баганаар холбодог. Жишээ: tasks.subject_id = subjects.id гэж холбовол даалгавар бүрийн хичээлийн нэрийг гаргаж авна.',
    review: '1) tasks ба subjects хүснэгтийг JOIN хийх query бич.\n2) GROUP BY ашиглан хичээл тус бүрийн даалгаврыг тоол.\n3) Primary key ба foreign key-ийн жишээ гарга.',
  },
  {
    keys: ['supabase', 'rls', 'auth', 'postgres'],
    summary: '• Supabase = PostgreSQL + Auth + Storage + API.\n• RLS нь хэрэглэгч бүрийг зөвхөн өөрийн мөртэй ажиллуулна.\n• Түлхүүрийг .env-д хадгална.',
    explain: 'Row Level Security идэвхжсэн үед хүснэгт бүрт policy бичнэ. Жишээ: auth.uid() = user_id нөхцөлтэй policy нь хэрэглэгчид зөвхөн өөрийн даалгаврыг харуулна.',
    review: '1) RLS яагаад хэрэгтэйг тайлбарла.\n2) tasks хүснэгтэд select policy бич.\n3) anon key ба service key-ийн ялгааг тодорхойл.',
  },
];

function fallback(question: string, mode: AIMode): string {
  if (mode === 'summary') {
    return `"${question}" сэдвийн хураангуй (жишээ):\n• Гол ойлголтуудыг 3-5 мөрөөр бич.\n• Тодорхойлолт бүрд нэг жишээ хавсарга.\n• Сүүлд нь өөрийн үгээр нэгтгэ.`;
  }
  if (mode === 'review') {
    return `"${question}" сэдвээр давтах санал:\n1) Лекцийн тэмдэглэлээ 10 минут уншина.\n2) Ном хаагаад 3 гол санааг бичнэ.\n3) Quiz хэсгээс холбогдох тест бөглөнө.\n4) Маргааш дахин 5 минут давтана.`;
  }
  return `"${question}" гэсэн асуултын тайлбарын жишээ:\nЭхлээд ойлголтын тодорхойлолтыг ол, дараа нь энгийн жишээгээр тайлбарла, эцэст нь хичээлийн бусад сэдэвтэй хэрхэн холбогдохыг бод.`;
}

class MockAIService implements AIService {
  readonly isMock = true;

  async ask(question: string, mode: AIMode): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 600));
    const q = question.toLowerCase();
    const topic = topics.find((t) => t.keys.some((k) => q.includes(k)));
    const body = topic ? topic[mode] : fallback(question, mode);
    return `[Mock · ${modeLabels[mode]}]\n${body}`;
  }
}

export const aiService: AIService = new MockAIService();
