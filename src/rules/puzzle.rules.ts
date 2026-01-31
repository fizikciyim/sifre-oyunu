import { Rule } from "./rule.types";
const CAPTCHAS = [
  {
    id: "captcha_1",
    image: require("../assets/captcha/1.png"),
    answer: "TK58P",
  },
  {
    id: "captcha_2",
    image: require("../assets/captcha/2.png"),
    answer: "9M4BP",
  },
  {
    id: "captcha_3",
    image: require("../assets/captcha/3.png"),
    answer: "B4T9S",
  },
  {
    id: "captcha_4",
    image: require("../assets/captcha/4.png"),
    answer: "4NV3A",
  },
];

export const kacUcgenVar: Rule = {
  id: "kacUcgenVar",
  message: () => "Şifre aşağıda kaç tane üçgen olduğunu içermeli",
  image: require("../assets/puzzles/kacUcgen.png"),
  expectedAnswer: "13",
  check: (password) => password.includes("13"),
};

export function createRandomCaptchaRule(): Rule {
  const captcha = CAPTCHAS[Math.floor(Math.random() * CAPTCHAS.length)];

  return {
    id: captcha.id,
    message: () => "Görseldeki kod şifrede yer almalı.",
    image: captcha.image,
    expectedAnswer: captcha.answer,
    check: (password) => password.includes(captcha.answer),
  };
}
