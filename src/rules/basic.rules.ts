import { Rule } from "./rule.types";

/* =======================
   🔢 UZUNLUK KURALLARI
======================= */

/* Minimum uzunluk */
export const minLength = (len: number): Rule => ({
  id: `min_length_${len}`,
  message: () => `En az ${len} karakter`,
  check: (password) => password.length >= len,
});

/* Maksimum uzunluk */
export const maxLength = (len: number): Rule => ({
  id: `max_length_${len}`,
  message: () => `En fazla ${len} karakter`,
  check: (password) => password.length <= len,
});

/* =======================
   🔠 HARF KURALLARI
======================= */

export const mustStartWith = (char: string): Rule => ({
  id: `must_start_with_${char}`,
  message: () => `Parola yalnızca "${char}" harfiyle başlayabilir`,
  check: (password) => password.startsWith(char),
});

/* En az 1 büyük harf */
export const hasUppercase: Rule = {
  id: "has_uppercase",
  message: () => "En az 1 büyük harf",
  check: (password) => /[A-Z]/.test(password),
};

export const noUppercaseAtEdges: Rule = {
  id: "no_uppercase_at_edges",
  message: () => "Şifrenin büyük ile bitemez.",
  check: (password) => {
    if (password.length === 0) return false;

    const last = password[password.length - 1];

    if (/[A-Z]/.test(last)) return false;

    return true;
  },
  shouldShow: (password) =>
    password.length > 0 &&
    (/[A-Z]/.test(password[0]) || /[A-Z]/.test(password[password.length - 1])),
};

/* =======================
   🔢 SAYI KURALLARI
======================= */

/* En az 1 rakam */
export const hasNumber: Rule = {
  id: "has_number",
  message: () => "En az 1 rakam",
  check: (password) => /[0-9]/.test(password),
};

/* =======================
   ✳️ ÖZEL KARAKTERLER
======================= */

/* En az 1 özel karakter */
export const hasSpecialChar: Rule = {
  id: "has_special_char",
  message: () => "En az 1 özel karakter",
  check: (password) => /[^a-zA-Z0-9]/.test(password),
};

/* =======================
   🚫 YASAKLAR
======================= */

/* Aynı karakter art arda gelemez */
export const noRepeatedChars: Rule = {
  id: "no_repeated_chars",
  message: () => "Aynı karakter art arda kullanılamaz",
  check: (password) => !/(.)\1/.test(password),
};

export const noFourCharPalindromeHidden: Rule = {
  id: "no_four_char_palindrome_hidden",

  message: () => "Şifre içinde 4 karakterlik bir palindrom olamaz.",

  check: (password) => {
    const chars = Array.from(password);

    for (let i = 0; i <= chars.length - 4; i++) {
      const slice = chars.slice(i, i + 4);
      const reversed = [...slice].reverse();

      if (slice.join("") === reversed.join("")) {
        return false;
      }
    }

    return true;
  },

  shouldShow: (password) => {
    const chars = Array.from(password);

    for (let i = 0; i <= chars.length - 4; i++) {
      const slice = chars.slice(i, i + 4);
      const reversed = [...slice].reverse();

      if (slice.join("") === reversed.join("")) {
        return true;
      }
    }

    return false;
  },
};

export const mustContainCurrentHour: Rule = {
  id: "must_contain_current_hour",
  message: () => {
    return `Şifre şu anki saati içermeli`;
  },
  check: (password) => {
    const hour = new Date().getHours().toString().padStart(2, "0");
    return password.includes(hour);
  },
};
export const stripIgnoredBlocks = (password: string) => {
  return password.replace(/\^.*?\^/g, "");
};

export const numbersMustBeSorted: Rule = {
  id: "numbers_must_be_sorted",
  message: () =>
    "Şifredeki rakamlar küçükten büyüğe sıralı olmalı (^ ^ içindekiler sayılmaz)",
  check: (password) => {
    const cleanPassword = stripIgnoredBlocks(password);

    const nums = cleanPassword.match(/[0-9]/g)?.map(Number) || [];

    if (nums.length < 2) return true;

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i - 1]) return false;
    }

    return true;
  },
};

export const maxTwoCarets: Rule = {
  id: "max_two_carets",
  message: () => "Şifre içinde en fazla 2 tane ^ sembolü olabilir",
  check: (password) => {
    const count = (password.match(/\^/g) || []).length;
    return count <= 2;
  },

  shouldShow: (password) => {
    const count = (password.match(/\^/g) || []).length;
    return count >= 3;
  },
};
/* =======================
   🧠 OYUNSAL / İLERİ SEVİYE
======================= */

/* Şifre bir sayı ile başlayamaz */
export const notStartWithNumber: Rule = {
  id: "not_start_with_number",
  message: () => "Şifre bir rakamla başlayamaz",

  check: (password) => !/^[0-9]/.test(password),

  shouldShow: (password) => /^[0-9]/.test(password),
};

export const productOfNumbersMax = (max: number): Rule => ({
  id: `product_numbers_max_${max}`,
  message: () => `Rakamların çarpımı ${max}'i geçmemeli`,
  check: (password) => {
    const numbers = password.match(/[0-9]/g)?.map(Number) || [];
    if (numbers.length === 0) return true;

    const product = numbers.reduce((acc, n) => acc * n, 1);
    return product <= max;
  },
});

export const containsRomanNumeral: Rule = {
  id: "contains_roman_numeral",
  message: () => "Şifre bir Roma rakamı içermeli",
  check: (password) => /[IVXLCDM]/.test(password),
};

export const containsAlkaliMetal: Rule = {
  id: "contains_alkali_metal",
  message: () =>
    "Şifre periyodik tablodan 2 harfli bir alkali metal element sembolü içermeli",
  check: (password) => {
    const alkaliMetals = ["Li", "Na", "Rb", "Cs", "Fr"];
    return alkaliMetals.some((symbol) => password.includes(symbol));
  },
};
const INFINITY = "∞";

export const containsInfinitySymbol: Rule = {
  id: "contains_infinity_symbol",
  message: () => "Şifre sonsuzluk sembolü içermeli",
  check: (password) => password.includes(INFINITY),
};
export const containsPlanet: Rule = {
  id: "contains_planet",
  message: () => "Şifre Güneş sisteminden bir gezegen ismi içermeli",
  check: (password) =>
    /(merkür|venüs|dünya|mars|jüpiter|satürn|uranüs|neptün)/i.test(password),
};
export const planetStartsWithUppercase: Rule = {
  id: "planet_starts_with_uppercase",
  message: () => "Gezegen isimleri büyük harfle başlar",

  check: (password) =>
    /(Merkür|Venüs|Dünya|Mars|Jüpiter|Satürn|Uranüs|Neptün)/.test(password),

  shouldShow: (password) =>
    /(merkür|venüs|dünya|mars|jüpiter|satürn|uranüs|neptün)/.test(password),
};

export const containsAbsoluteZero: Rule = {
  id: "contains_absolute_zero",
  message: () => "Mutlak sıfır sıcaklığını ondalıklı biçimde içermeli (°C)",
  check: (password) => /-273\.15/.test(password),
};
export const containsEiffelCity: Rule = {
  id: "contains_eiffel_city",
  message: () => "Şifre Eyfel Kulesi'nin bulunduğu şehri içermeli",
  check: (password) => /paris/i.test(password),
};

export const maxOneDot: Rule = {
  id: "max_one_dot",
  message: () => "Şifre içinde en fazla 1 tane nokta (.) olabilir",

  check: (password) => {
    const count = (password.match(/\./g) || []).length;
    return count <= 1;
  },

  shouldShow: (password) => {
    const count = (password.match(/\./g) || []).length;
    return count > 1;
  },
};
const HAMSTER = "🐹";

/* 🐹 Hamster'ı koru */
export const protectHamster: Rule = {
  id: "protect_hamster",
  message: () =>
    "🐹 Hamsterın kayboldu. Onu şifrenin içine sakla. Dikkat et kaybolmasın.",
  copyValue: HAMSTER,
  check: (password) => password.includes(HAMSTER),
};

/* 🐹 Hamster sayılar arasında olmalı */
export const hamsterBetweenNumbers: Rule = {
  id: "hamster_between_numbers",
  message: () =>
    "🐹 Hamster sayılar arasında kendini güvende hisseder. İki tarafında da rakam olmalı.",
  copyValue: HAMSTER,

  check: (password) => {
    const chars = Array.from(password);

    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === HAMSTER) {
        const left = chars[i - 1];
        const right = chars[i + 1];

        if (left && right && /[0-9]/.test(left) && /[0-9]/.test(right)) {
          return true; // ✅ en az bir hamster doğru yerde
        }
      }
    }

    return false; // ❌ hiçbiri güvende değil
  },
};

/* 🐹 Sadece bir tane hamster */
export const onlyOneHamster: Rule = {
  id: "only_one_hamster",
  message: () => "🐹 Hamster’dan sadece bir tane var. Öteki de nereden çıktı?",
  check: (password) => {
    const chars = Array.from(password);
    const hamsterCount = chars.filter((c) => c === HAMSTER).length;
    return hamsterCount === 1;
  },

  shouldShow: (password) => {
    const chars = Array.from(password);
    const hamsterCount = chars.filter((c) => c === HAMSTER).length;
    return hamsterCount >= 2; // 🪤 sadece tuzağa düşerse göster
  },
};
