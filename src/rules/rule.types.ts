export type RuleContext = {
  minute?: number;
  targetNumber?: number;
};

export type Rule = {
  id: string;
  message: () => string;
  check: (password: string) => boolean;

  // 👇 SADECE RESİMLİ KURALLAR İÇİN
  image?: any; // require(...) ile resim
  expectedAnswer?: string; // şifrede aranacak cevap

  shouldShow?: (password: string) => boolean;
};
