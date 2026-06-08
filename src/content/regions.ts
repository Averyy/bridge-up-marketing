// Region facts + localized display for the bridge/region pages. Display names and
// the human-written hub `description` (the indexable intro at the top of each
// region page) live here, not in messages/*.json, because the region keys are
// hyphenated slugs and this keeps all region content in one typed place.
// Descriptions are EVERGREEN (no live numbers) and reviewed before publish.

import { Locale } from "@/i18n/routing";

export interface RegionDisplay {
  name: string;
  city: string;
  waterway: string;
  description: string;
}

export interface RegionMeta {
  province: string;
  provinceCode: string;
  seawayUrl: string;
  display: Record<Locale, RegionDisplay>;
}

export const REGION_META: Record<string, RegionMeta> = {
  "st-catharines": {
    province: "Ontario",
    provinceCode: "ON",
    seawayUrl: "https://seaway-greatlakes.com/bridgestatus/detailsnai?key=BridgeSCT",
    display: {
      en: {
        name: "St. Catharines",
        city: "St. Catharines",
        waterway: "the Welland Canal",
        description:
          "St. Catharines sits where the Welland Canal meets Lake Ontario, and the canal cuts straight through the city, so a lot of everyday driving here means crossing it. Five of the canal's lift and bascule bridges are in and around town, from Lakeshore Road at Port Weller down to the Highway 20 bridge at Allanburg. Each one stops road traffic when a Seaway ship comes through, and on a busy day the waits add up. Below is the live status of all five, plus how long each one usually stays down.",
      },
      fr: {
        name: "St. Catharines",
        city: "St. Catharines",
        waterway: "le canal Welland",
        description:
          "St. Catharines se trouve là où le canal Welland rejoint le lac Ontario, et le canal traverse la ville de part en part : ici, conduire au quotidien veut souvent dire le franchir. Cinq des ponts levants et basculants du canal sont en ville et aux alentours, de Lakeshore Road à Port Weller jusqu'au pont de la Highway 20 à Allanburg. Chacun arrête la circulation au passage d'un navire de la Voie maritime, et les attentes s'accumulent dans une journée chargée. Vous trouverez ci-dessous l'état en direct des cinq, et la durée habituelle de chaque fermeture.",
      },
      es: {
        name: "St. Catharines",
        city: "St. Catharines",
        waterway: "el canal Welland",
        description:
          "St. Catharines está donde el canal Welland se encuentra con el lago Ontario, y el canal atraviesa la ciudad de lado a lado: aquí, conducir a diario suele significar cruzarlo. Cinco de los puentes elevadores y basculantes del canal están en la ciudad y sus alrededores, desde Lakeshore Road en Port Weller hasta el puente de la Highway 20 en Allanburg. Cada uno detiene el tráfico cuando pasa un barco de la vía marítima, y en un día con mucho movimiento las esperas se acumulan. Abajo está el estado en vivo de los cinco y cuánto suele durar cada cierre.",
      },
    },
  },
  "port-colborne": {
    province: "Ontario",
    provinceCode: "ON",
    seawayUrl: "https://seaway-greatlakes.com/bridgestatus/detailsnai?key=BridgePC",
    display: {
      en: {
        name: "Port Colborne",
        city: "Port Colborne",
        waterway: "the Welland Canal",
        description:
          "Port Colborne is the Lake Erie end of the Welland Canal, where ships finish the run down from Lake Ontario. Three movable bridges carry traffic across the canal here: Main Street and Mellanby Avenue near Lock 8, and the Clarence Street lift bridge closer to the lake. When a freighter is passing, the bridge goes up and the only options are to wait or find another crossing. The live status and typical closure time for all three are below.",
      },
      fr: {
        name: "Port Colborne",
        city: "Port Colborne",
        waterway: "le canal Welland",
        description:
          "Port Colborne marque l'extrémité du canal Welland sur le lac Érié, là où les navires terminent leur descente depuis le lac Ontario. Trois ponts mobiles font passer la circulation par-dessus le canal : Main Street et Mellanby Avenue près de l'écluse 8, et le pont levant de Clarence Street, plus près du lac. Quand un cargo passe, le pont se lève et il ne reste qu'à attendre ou à trouver un autre passage. L'état en direct et la durée habituelle de fermeture des trois se trouvent ci-dessous.",
      },
      es: {
        name: "Port Colborne",
        city: "Port Colborne",
        waterway: "el canal Welland",
        description:
          "Port Colborne es el extremo del canal Welland sobre el lago Erie, donde los barcos terminan su descenso desde el lago Ontario. Tres puentes móviles cruzan el canal aquí: Main Street y Mellanby Avenue cerca de la esclusa 8, y el puente elevador de Clarence Street, más cerca del lago. Cuando pasa un carguero, el puente se levanta y solo queda esperar o buscar otro cruce. Abajo está el estado en vivo y la duración habitual de cierre de los tres.",
      },
    },
  },
  montreal: {
    province: "Québec",
    provinceCode: "QC",
    seawayUrl: "https://seaway-greatlakes.com/bridgestatus/detailsnai?key=BridgeM",
    display: {
      en: {
        name: "Montréal South Shore",
        city: "Montréal",
        waterway: "the St. Lawrence Seaway",
        description:
          "On Montréal's South Shore, the St. Lawrence Seaway runs between the island and the mainland, and the crossings open to let ships through. Bridge Up tracks the movable spans here: the Victoria Bridge linking Montréal to Saint-Lambert, and the Sainte-Catherine bridge by the RécréoParc. A Seaway closure can hold up a commute with little warning, so it pays to check before you head out. Below is the live status and how long each crossing usually stays closed.",
      },
      fr: {
        name: "Rive-Sud de Montréal",
        city: "Montréal",
        waterway: "la Voie maritime du Saint-Laurent",
        description:
          "Sur la Rive-Sud de Montréal, la Voie maritime du Saint-Laurent passe entre l'île et la terre ferme, et les traversées s'ouvrent pour laisser passer les navires. Bridge Up suit les travées mobiles d'ici : le pont Victoria, qui relie Montréal à Saint-Lambert, et le pont de Sainte-Catherine, près du RécréoParc. Une fermeture de la Voie maritime peut bloquer un trajet sans grand préavis, alors mieux vaut vérifier avant de partir. Voici l'état en direct et la durée habituelle de chaque fermeture.",
      },
      es: {
        name: "Orilla sur de Montreal",
        city: "Montréal",
        waterway: "la vía marítima del San Lorenzo",
        description:
          "En la orilla sur de Montreal, la vía marítima del San Lorenzo pasa entre la isla y tierra firme, y los cruces se abren para dejar pasar los barcos. Bridge Up sigue los tramos móviles de aquí: el puente Victoria, que une Montreal con Saint-Lambert, y el puente de Sainte-Catherine, junto al RécréoParc. Un cierre de la vía marítima puede frenar un trayecto con poco aviso, así que conviene comprobarlo antes de salir. Abajo está el estado en vivo y cuánto suele estar cerrado cada cruce.",
      },
    },
  },
  beauharnois: {
    province: "Québec",
    provinceCode: "QC",
    seawayUrl: "https://seaway-greatlakes.com/bridgestatus/detailsmai2?key=BridgeSBS",
    display: {
      en: {
        name: "Beauharnois & Salaberry-de-Valleyfield",
        city: "Salaberry-de-Valleyfield",
        waterway: "the St. Lawrence Seaway",
        description:
          "West of Montréal, in the Suroît, the St. Lawrence Seaway runs through the Beauharnois Canal past Salaberry-de-Valleyfield and Beauharnois. Two vertical-lift bridges carry traffic across it: the Larocque Bridge at Salaberry-de-Valleyfield, and the Saint-Louis-de-Gonzague bridge a little upstream. Both raise their centre spans for passing ships, closing the road for a stretch each time. Here's the live status and the typical closure time for each.",
      },
      fr: {
        name: "Beauharnois et Salaberry-de-Valleyfield",
        city: "Salaberry-de-Valleyfield",
        waterway: "la Voie maritime du Saint-Laurent",
        description:
          "À l'ouest de Montréal, dans le Suroît, la Voie maritime du Saint-Laurent emprunte le canal de Beauharnois, près de Salaberry-de-Valleyfield et de Beauharnois. Deux ponts levants font traverser la circulation : le pont Larocque, à Salaberry-de-Valleyfield, et le pont Saint-Louis-de-Gonzague, un peu en amont. Les deux lèvent leur travée centrale au passage des navires, fermant la route un moment chaque fois. Voici l'état en direct et la durée habituelle de fermeture de chacun.",
      },
      es: {
        name: "Beauharnois y Salaberry-de-Valleyfield",
        city: "Salaberry-de-Valleyfield",
        waterway: "la vía marítima del San Lorenzo",
        description:
          "Al oeste de Montreal, en la región del Suroît, la vía marítima del San Lorenzo pasa por el canal de Beauharnois, cerca de Salaberry-de-Valleyfield y Beauharnois. Dos puentes de elevación vertical cruzan el canal: el puente Larocque, en Salaberry-de-Valleyfield, y el puente Saint-Louis-de-Gonzague, un poco más arriba. Ambos levantan su tramo central al paso de los barcos y cierran la carretera un rato cada vez. Aquí tienes el estado en vivo y la duración habitual de cierre de cada uno.",
      },
    },
  },
};

export function getRegionDisplay(regionId: string, locale: Locale): RegionDisplay | undefined {
  return REGION_META[regionId]?.display[locale];
}
