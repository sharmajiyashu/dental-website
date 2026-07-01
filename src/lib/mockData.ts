export interface User {
  id: string;
  name: string;
  age: string;
  gender: string;
  role: string;
  email: string;
  mobile: string;
  healthScore: number;
  stepsLogged: number;
  stepsTarget: number;
  waterLogged: number;
  waterTarget: number;
  sleepLogged: number;
  sleepTarget: number;
  weight: number;
  reminders: {
    drinkWater: boolean;
    morningWalk: boolean;
    takeMedicine: boolean;
    sleepEarly: boolean;
  };
  registrationDate: string;
}

export interface SurveyResponse {
  id: string;
  name: string;
  age: string;
  gender: string;
  education: string;
  occupation: string;
  answers: {
    brushFrequency: string;
    useToothpaste: string;
    flossFrequency: string;
    useMouthwash: string;
    dentistVisits: string;
    triviaAnswer: string;
  };
  score: number; // percentage
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  category: "Oral Health" | "Nutrition" | "Fitness" | "Mental Health";
  readTime: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  steps?: string[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "New" | "Replied";
}

// Initial Data
export const initialUsers: User[] = [
  {
    id: "u-1",
    name: "Rahul Sharma",
    age: "24",
    gender: "Male",
    role: "Student",
    email: "rahul@example.com",
    mobile: "+91 98765 43210",
    healthScore: 80,
    stepsLogged: 6245,
    stepsTarget: 10000,
    waterLogged: 6,
    waterTarget: 8,
    sleepLogged: 7.3,
    sleepTarget: 8,
    weight: 65.5,
    reminders: {
      drinkWater: true,
      morningWalk: true,
      takeMedicine: false,
      sleepEarly: true,
    },
    registrationDate: "2026-06-15",
  },
  {
    id: "u-2",
    name: "Aanya Patel",
    age: "30",
    gender: "Female",
    role: "Parent",
    email: "aanya@example.com",
    mobile: "+91 98123 45678",
    healthScore: 92,
    stepsLogged: 9500,
    stepsTarget: 10000,
    waterLogged: 8,
    waterTarget: 8,
    sleepLogged: 8.1,
    sleepTarget: 8.5,
    weight: 58.2,
    reminders: {
      drinkWater: true,
      morningWalk: false,
      takeMedicine: true,
      sleepEarly: true,
    },
    registrationDate: "2026-06-20",
  },
  {
    id: "u-3",
    name: "Vikram Malhotra",
    age: "45",
    gender: "Male",
    role: "Working Professional",
    email: "vikram@example.com",
    mobile: "+91 99887 76655",
    healthScore: 68,
    stepsLogged: 4200,
    stepsTarget: 8000,
    waterLogged: 4,
    waterTarget: 8,
    sleepLogged: 5.5,
    sleepTarget: 7.5,
    weight: 84.1,
    reminders: {
      drinkWater: false,
      morningWalk: true,
      takeMedicine: true,
      sleepEarly: false,
    },
    registrationDate: "2026-06-28",
  }
];

export const initialSurveys: SurveyResponse[] = [
  {
    id: "s-1",
    name: "Rahul Sharma",
    age: "24",
    gender: "Male",
    education: "Graduate",
    occupation: "Student",
    answers: {
      brushFrequency: "Twice a day",
      useToothpaste: "Yes, always",
      flossFrequency: "Sometimes",
      useMouthwash: "Occasionally",
      dentistVisits: "Once a year",
      triviaAnswer: "Brush for 2 minutes, twice a day",
    },
    score: 90,
    correctCount: 9,
    wrongCount: 1,
    accuracy: 90,
    date: "2026-06-15 10:30 AM",
  },
  {
    id: "s-2",
    name: "Priya Das",
    age: "28",
    gender: "Female",
    education: "Postgraduate",
    occupation: "Engineer",
    answers: {
      brushFrequency: "Once a day",
      useToothpaste: "Yes, always",
      flossFrequency: "Never",
      useMouthwash: "No, never",
      dentistVisits: "Only when in pain",
      triviaAnswer: "Brush immediately after every meal",
    },
    score: 60,
    correctCount: 6,
    wrongCount: 4,
    accuracy: 60,
    date: "2026-06-22 04:15 PM",
  }
];

export const initialArticles: Article[] = [
  {
    id: "a-1",
    title: "How to Brush Properly",
    category: "Oral Health",
    readTime: "5 min read",
    description: "Learn correct brushing techniques for healthy teeth and gums to prevent cavities and maintain fresh breath.",
    videoUrl: "https://www.youtube.com/embed/5T8k91mOq7A", // Standard toothbrushing guide embed
    imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop",
    steps: [
      "Use a soft-bristled toothbrush and fluoride toothpaste.",
      "Place your toothbrush at a 45-degree angle to the gums.",
      "Gently move the brush back and forth in short (tooth-wide) strokes.",
      "Brush the outer surfaces, the inner surfaces, and the chewing surfaces of the teeth.",
      "Brush your tongue to remove bacteria and keep breath fresh.",
      "Brush for at least 2 minutes, twice a day."
    ]
  },
  {
    id: "a-2",
    title: "Benefits of Flossing",
    category: "Oral Health",
    readTime: "4 min read",
    description: "Flossing cleans between your teeth where a toothbrush can't reach. Discover why it's critical for gum health.",
    videoUrl: "https://www.youtube.com/embed/HhQnrykaztw",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
    steps: [
      "Use about 18 inches of floss wound around your middle fingers.",
      "Hold the floss tightly between your thumbs and forefingers.",
      "Guide the floss gently between your teeth using a gentle rubbing motion.",
      "Curve the floss into a C-shape against the side of each tooth.",
      "Slide the floss gently up and down against the tooth surface and under the gumline.",
      "Floss once a day, preferably before bedtime."
    ]
  },
  {
    id: "a-3",
    title: "Choosing the Right Toothpaste",
    category: "Oral Health",
    readTime: "3 min read",
    description: "Fluoride, whitening, sensitive? Here's how to navigate the toothpaste aisle and pick the best option for you.",
    imageUrl: "https://images.unsplash.com/photo-1549476464-37392f719c28?w=800&auto=format&fit=crop",
    steps: [
      "Always look for fluoride to protect against cavities.",
      "Choose sensitive toothpaste if cold or hot food causes discomfort.",
      "Avoid highly abrasive whitening toothpastes if you have thin enamel.",
      "Check for ADA (American Dental Association) approval seal."
    ]
  },
  {
    id: "a-4",
    title: "Balanced Diet for a Healthy Life",
    category: "Nutrition",
    readTime: "5 min read",
    description: "How eating leafy greens, reducing sugar, and staying hydrated directly translates to better teeth and daily health.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    steps: [
      "Incorporate crisp fruits and vegetables that clean teeth as you chew.",
      "Reduce processed sugars which feed decay-causing bacteria.",
      "Drink plenty of water to rinse away food particles and build saliva.",
      "Include calcium-rich foods like dairy or fortified almond milk to strengthen enamel."
    ]
  },
  {
    id: "a-5",
    title: "10 Easy Home Workouts",
    category: "Fitness",
    readTime: "7 min read",
    description: "No gym? No problem. Here are quick exercises to boost your cardiovascular health and overall vitality at home.",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop",
    steps: [
      "Warm up with 2 minutes of light jogging in place.",
      "Perform 3 sets of 12 bodyweight squats.",
      "Do 3 sets of 10 pushups (knees or standard).",
      "Engage your core with 3 sets of 30-second planks.",
      "Finish with dynamic stretching for cool down."
    ]
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: "e-1",
    name: "Amit Sen",
    email: "amit.sen@example.com",
    subject: "App Launch Date",
    message: "When will the Healthy Life mobile application be launched on iOS App Store? I'm excited to track my steps and oral hygiene.",
    date: "2026-06-29 09:00 AM",
    status: "New",
  },
  {
    id: "e-2",
    name: "Dr. Shruti Nair",
    email: "shruti.nair@dentists.org",
    subject: "Dentist Panel Integration",
    message: "Hi, I'm a dentist and would love to register my clinic on your app so my patients can share their scores. Is there a partnership plan?",
    date: "2026-06-30 02:30 PM",
    status: "New",
  }
];
