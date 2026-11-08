import type { Quiz } from '../types';

/** Mock quiz өгөгдөл. Дараа нь Supabase эсвэл AI-аас үүсгэж болно. */
export const quizzes: Quiz[] = [
  {
    id: 'q-rn',
    title: 'React Native үндэс',
    subject: 'Мобайл програмчлал',
    questions: [
      {
        id: 'rn1',
        question: 'React Native-д дэлгэц дээр текст харуулах үндсэн component аль нь вэ?',
        options: ['<div>', '<Text>', '<p>', '<span>'],
        correctIndex: 1,
        explanation: 'React Native-д бүх текст <Text> component дотор байх ёстой.',
      },
      {
        id: 'rn2',
        question: 'Component-ийн өөрчлөгддөг өгөгдлийг (state) хадгалах hook аль нь вэ?',
        options: ['useEffect', 'useState', 'useRef', 'useMemo'],
        correctIndex: 1,
        explanation: 'useState нь state хадгалж, утга өөрчлөгдөхөд component-ийг дахин render хийнэ.',
      },
      {
        id: 'rn3',
        question: 'Урт жагсаалтыг үр ашигтай харуулах component аль нь вэ?',
        options: ['ScrollView', 'View', 'FlatList', 'Pressable'],
        correctIndex: 2,
        explanation: 'FlatList нь зөвхөн дэлгэц дээр харагдаж буй мөрүүдийг render хийдэг.',
      },
      {
        id: 'rn4',
        question: 'Expo Router-д дэлгэцүүд юугаар тодорхойлогддог вэ?',
        options: ['app/ хавтас доторх файлуудаар', 'App.tsx доторх switch-ээр', 'XML тохиргоогоор', 'Redux store-оор'],
        correctIndex: 0,
        explanation: 'Expo Router нь file-based routing: app/ доторх файл бүр нэг дэлгэц болно.',
      },
      {
        id: 'rn5',
        question: 'React Native-д flexDirection-ийн анхдагч утга юу вэ?',
        options: ['row', 'column', 'row-reverse', 'none'],
        correctIndex: 1,
        explanation: 'Web-ээс ялгаатай нь React Native-д анхдагч чиглэл нь column.',
      },
    ],
  },
  {
    id: 'q-sql',
    title: 'SQL ба Supabase',
    subject: 'Өгөгдлийн сан',
    questions: [
      {
        id: 'db1',
        question: 'Хүснэгтийн мөр бүрийг давтагдашгүй тодорхойлох багана юу вэ?',
        options: ['Foreign key', 'Primary key', 'Index', 'View'],
        correctIndex: 1,
        explanation: 'Primary key нь мөр бүрийг давхардалгүй ялгана.',
      },
      {
        id: 'db2',
        question: 'Хүснэгтээс өгөгдөл унших SQL команд аль нь вэ?',
        options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
        correctIndex: 2,
        explanation: 'SELECT нь өгөгдлийг уншиж буцаадаг.',
      },
      {
        id: 'db3',
        question: 'Supabase-д хэрэглэгч зөвхөн өөрийн мөрийг харах боломжийг юу олгодог вэ?',
        options: ['Row Level Security', 'CORS', 'Trigger', 'Cron job'],
        correctIndex: 0,
        explanation: 'RLS policy нь мөр бүрийн хандалтыг auth.uid()-аар шалгана.',
      },
      {
        id: 'db4',
        question: 'Өөр хүснэгтийн primary key-г зааж буй баганыг юу гэдэг вэ?',
        options: ['Unique key', 'Foreign key', 'Composite key', 'Surrogate key'],
        correctIndex: 1,
        explanation: 'Foreign key нь хоёр хүснэгтийг холбодог.',
      },
      {
        id: 'db5',
        question: 'Supabase ямар өгөгдлийн сан дээр суурилдаг вэ?',
        options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'],
        correctIndex: 2,
        explanation: 'Supabase нь PostgreSQL дээр ажилладаг.',
      },
    ],
  },
];
