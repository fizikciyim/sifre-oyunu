import {
  containsAbsoluteZero,
  containsAlkaliMetal,
  containsEiffelCity,
  containsInfinitySymbol,
  containsPlanet,
  containsRomanNumeral,
  hamsterBetweenNumbers,
  hasNumber,
  hasSpecialChar,
  hasUppercase,
  maxOneDot,
  maxTwoCarets,
  minLength,
  mustContainCurrentHour,
  noFourCharPalindromeHidden,
  notStartWithNumber,
  noUppercaseAtEdges,
  numbersMustBeSorted,
  onlyOneHamster,
  planetStartsWithUppercase,
  productOfNumbersMax,
  protectHamster,
} from "../rules";
import { createRandomCaptchaRule, kacUcgenVar } from "../rules/puzzle.rules";
import { Level } from "./level.types";
const level: Level = {
  id: 1,
  title: "Bölüm 1 – Her Şey Aynı Anda",
  description:
    "Bu bölümde kurallar üst üste binecek. Bazıları diğerlerini bozacak. Hepsi aynı anda geçerli.",

  rules: [
    minLength(5),

    hasNumber,
    hasUppercase,
    hasSpecialChar,

    createRandomCaptchaRule(),

    containsInfinitySymbol,
    containsAbsoluteZero,
    protectHamster,
    containsEiffelCity,
    hamsterBetweenNumbers,
    kacUcgenVar,
    numbersMustBeSorted,

    productOfNumbersMax(9999),
    mustContainCurrentHour,

    containsPlanet,
    planetStartsWithUppercase,
    containsAlkaliMetal,

    containsRomanNumeral,
  ],
  conditionalRules: [
    notStartWithNumber,
    noUppercaseAtEdges,

    maxTwoCarets,
    noFourCharPalindromeHidden,
    onlyOneHamster,
    maxOneDot,
  ],
};

export default level;
