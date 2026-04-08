import type { Animal } from "../types/animal";
import Arthur from "../assets/images/Arthur.png";
import Doris from "../assets/images/Doris.png";
import Kalle from "../assets/images/Kalle.png";
import Merlin from "../assets/images/Merlin.png";
import Mjausalot from "../assets/images/Mjausalot.png";
import Nyx from "../assets/images/Nyx.png";
import Simba from "../assets/images/Simba.png";
import Wiggles from "../assets/images/Wiggles.png";

export const mockAnimals: Animal[] = [
  {
    id: "1",
    type: "Hund",
    breed: "Labrador",
    image: Kalle,
    name: "Kalle",
    age: 3,
    keyTraits: "Busig",
    personality: "Lekfull och social",
    description:
      "Kalle älskar människor och lär sig snabbt nya saker. Han passar bra i en aktiv familj som vill hitta på roliga vardagsäventyr.",
    likes: ["Långa promenader", "Bollkastning", "Mys i soffan"],
  },

  {
    id: "2",
    type: "Hund",
    breed: "Bulldog",
    image: Doris,
    name: "Doris",
    age: 2,
    keyTraits: "Lat",
    personality: "Lugn och charmig",
    description:
      "Doris tar livet i sin egen takt och trivs i ett hem med mycket närhet. Hon är en trygg kompis som gillar rutiner.",
    likes: ["Korta promenader", "Tuggben", "Långa tupplurar"],
  },

  {
    id: "3",
    type: "Katt",
    breed: "Norsk Skogskatt",
    image: Simba,
    name: "Simba",
    age: 5,
    keyTraits: "Självständig",
    personality: "Självständig men varm",
    description:
      "Simba tycker om att ha egen tid men söker gärna kontakt när han känner sig trygg. Han är nyfiken, klok och väldigt stilig.",
    likes: ["Höga klösträd", "Fönsterplatser", "Kvällsgos"],
  },

  {
    id: "4",
    type: "Katt",
    breed: "Maine Coon",
    image: Mjausalot,
    name: "Mjausalot",
    age: 12,
    keyTraits: "Blyg",
    personality: "Försiktig och mjuk",
    description:
      "Mjausalot behöver lite tid för att landa i nya miljöer, men blommar ut med tålamod. Hon passar i ett lugnt hem utan för mycket stress.",
    likes: ["Mjuka filtar", "Lugna klappar", "Tysta hörn"],
  },

  {
    id: "5",
    type: "Reptil",
    breed: "Kungspyton",
    image: Nyx,
    name: "Nyx",
    age: 3,
    keyTraits: "Kelig",
    personality: "Nyfiken och trygg",
    description:
      "Nyx är hanteringsvan och visar ett lugnt temperament. Hon trivs med en stabil rutin och en ägare som kan ge rätt miljö och temperatur.",
    likes: ["Värmematta", "Trygga gömställen", "Lugn hantering"],
  },

  {
    id: "6",
    type: "Reptil",
    breed: "Mjölksnok",
    image: Wiggles,
    name: "Wiggles",
    age: 8,
    keyTraits: "Lugn",
    personality: "Lugn och observant",
    description:
      "Wiggles är en stabil och lättskött vän för dig som uppskattar reptiler. Han mår bäst med fasta rutiner och en ren, säker terrariemiljö.",
    likes: ["Varm solplats", "Gömställen", "Förutsägbar skötsel"],
  },

  {
    id: "7",
    type: "Fågel",
    breed: "Grå jako",
    image: Merlin,
    name: "Merlin",
    age: 15,
    keyTraits: "Pratglad",
    personality: "Social och smart",
    description:
      "Merlin är väldigt intelligent och söker daglig kontakt. Han behöver mental stimulans och en familj som har tid att prata, leka och träna.",
    likes: ["Pusselleksaker", "Pratstunder", "Färska frukter"],
  },

  {
    id: "8",
    type: "Fågel",
    breed: "Kakadua",
    image: Arthur,
    name: "Arthur",
    age: 20,
    keyTraits: "Skygg",
    personality: "Försiktig men nyfiken",
    description:
      "Arthur bygger tillit steg för steg och uppskattar respektfullt bemötande. Med tålamod blir han en lojal och charmig vardagskompis.",
    likes: ["Lugn musik", "Långsam tillvänjning", "Trygga rutiner"],
  },
];
