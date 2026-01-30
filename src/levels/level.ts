import {
  containsAlkaliMetal,
  containsPlanet,
  containsRomanNumeral,
  hamsterBetweenNumbers,
  hasNumber,
  hasSpecialChar,
  hasUppercase,
  maxTwoCarets,
  minLength,
  mustContainCurrentHour,
  noDot,
  noFourCharPalindromeHidden,
  noRepeatedChars,
  notStartWithNumber,
  noUppercaseAtEdges,
  numbersMustBeSorted,
  onlyOneHamster,
  planetStartsWithUppercase,
  productOfNumbersMax,
  protectHamster,
  sumOfNumbersEquals,
} from "../rules";
import {
  createRandomCaptchaRule,
  createRandomShapePuzzle,
  kacUcgenVar,
} from "../rules/puzzle.rules";
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
    noUppercaseAtEdges,
    createRandomCaptchaRule(),

    numbersMustBeSorted,

    sumOfNumbersEquals(25),
    productOfNumbersMax(9999),

    hasSpecialChar,
    noDot,

    protectHamster,
    hamsterBetweenNumbers,

    mustContainCurrentHour,

    containsPlanet,
    planetStartsWithUppercase,
    containsAlkaliMetal,

    containsRomanNumeral,

    createRandomShapePuzzle(),
    kacUcgenVar,

    noRepeatedChars,
  ],
  conditionalRules: [
    notStartWithNumber,
    maxTwoCarets,
    noFourCharPalindromeHidden,
    onlyOneHamster,
  ],
};

export default level;
