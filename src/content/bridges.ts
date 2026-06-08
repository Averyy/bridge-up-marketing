// Per-bridge editorial copy for the SEO landing pages. EVERGREEN only — never put
// live numbers here (averages, counts); those come from the API and refresh daily
// via ISR. This is the unique, human-written content that keeps each page from
// reading like a templated clone. Facts sourced from the official Great Lakes
// St. Lawrence Seaway bridge-status pages, Wikipedia, Brock University's Welland
// Canal exhibit, HistoricBridges, and Waterway Guide. Reviewed by Avery before publish.
//
// `name`  — locale-invariant display name (proper noun), used in titles/H1/body.
// `city`  — overrides the region's main city in the answer block, for bridges that
//           sit in a different town than the region hub (e.g. Highway 20 in Thorold).

import { Locale } from "@/i18n/routing";

export interface BridgeSpan {
  apiId: string;
  label: Partial<Record<Locale, string>>;
}

export interface BridgeContent {
  name: string;
  city?: string;
  // Extra movable spans shown as separate live statuses (e.g. the Victoria Bridge's
  // road deck + its upstream cycling/pedestrian path, tracked separately in the app).
  spans?: BridgeSpan[];
  intro: Partial<Record<Locale, string>>;
}

export const BRIDGE_CONTENT: Record<string, BridgeContent> = {
  "lakeshore-rd": {
    name: "Lakeshore Rd",
    intro: {
      en: "Lakeshore Road crosses the Welland Canal at Port Weller, where the canal opens into Lake Ontario in St. Catharines. It's Bridge 1, a bascule: the deck tips back on a counterweight to clear the channel. Ships heading in from the lake pass under it first.",
      fr: "Lakeshore Road franchit le canal Welland à Port Weller, là où le canal débouche sur le lac Ontario à St. Catharines. C'est le pont 1, un pont basculant : le tablier bascule sur un contrepoids pour libérer le chenal. C'est le premier pont sous lequel passent les navires venus du lac.",
      es: "Lakeshore Road cruza el canal Welland en Port Weller, donde el canal desemboca en el lago Ontario, en St. Catharines. Es el puente 1, de tipo basculante: el tablero se inclina sobre un contrapeso para despejar el canal. Es el primero por el que pasan los barcos que entran desde el lago.",
    },
  },
  "carlton-st": {
    name: "Carlton St",
    intro: {
      en: "Carlton Street, Regional Road 83, crosses the Welland Canal in St. Catharines as Bridge 3A. The odd number is a bit of canal history: it replaced the original Bridge 3 after an accident. It's a bascule, so the deck swings up on a counterweight when a ship needs through.",
      fr: "Carlton Street, la route régionale 83, traverse le canal Welland à St. Catharines : c'est le pont 3A. Le numéro vient d'un bout d'histoire du canal, puisqu'il a remplacé le pont 3 d'origine après un accident. C'est un pont basculant : le tablier se relève sur un contrepoids au passage d'un navire.",
      es: "Carlton Street, la carretera regional 83, cruza el canal Welland en St. Catharines: es el puente 3A. El número curioso viene de la historia del canal, ya que reemplazó al puente 3 original tras un accidente. Es basculante: el tablero se levanta sobre un contrapeso cuando pasa un barco.",
    },
  },
  "queenston-st": {
    name: "Queenston St",
    intro: {
      en: "The Queenston Street bridge, which locals still call the Homer Bridge, has carried traffic over the Welland Canal in St. Catharines since 1928. It's Bridge 4, a rolling-lift bascule: the deck rolls back on a curved base to lift open for ships. Traffic backed up here so badly that the Garden City Skyway was built over the canal in 1963; Queenston Street still handles the local crossing.",
      fr: "Le pont de Queenston Street, que les gens du coin appellent encore le pont Homer, fait passer la circulation au-dessus du canal Welland à St. Catharines depuis 1928. C'est le pont 4, un pont basculant à roulement : le tablier roule vers l'arrière sur une base courbe pour se soulever et laisser passer les navires. Les bouchons y étaient tels qu'on a construit le Garden City Skyway par-dessus le canal en 1963; Queenston Street sert encore au passage local.",
      es: "El puente de Queenston Street, que los vecinos siguen llamando Homer Bridge, cruza el canal Welland en St. Catharines desde 1928. Es el puente 4, un basculante de rodillo: el tablero rueda hacia atrás sobre una base curva para levantarse y dejar pasar los barcos. Los atascos eran tan grandes que en 1963 se construyó el Garden City Skyway sobre el canal; Queenston Street sigue siendo el cruce local.",
    },
  },
  "glendale-ave": {
    name: "Glendale Ave",
    intro: {
      en: "The Glendale Avenue bridge carries traffic over the Welland Canal in St. Catharines. It's Bridge 5, a vertical-lift bridge, so when a Seaway ship comes through the whole deck rises straight up and cars wait on both sides until it drops back down. Most lifts are quick, but they're easy to get caught by if you haven't checked first.",
      fr: "Le pont de Glendale Avenue traverse le canal Welland à St. Catharines. C'est le pont 5, un pont levant : quand un navire de la Voie maritime approche, le tablier monte à la verticale et la circulation attend des deux côtés qu'il redescende. La plupart des levées sont courtes, mais on se fait facilement prendre quand on n'a pas vérifié avant de partir.",
      es: "El puente de Glendale Avenue cruza el canal Welland en St. Catharines. Es el puente 5, de elevación vertical: cuando pasa un barco de la vía marítima, el tablero sube en línea recta y el tráfico espera a ambos lados hasta que baja. La mayoría de las elevaciones son rápidas, pero es fácil quedar atrapado si no lo revisas antes de salir.",
    },
  },
  "highway-20": {
    name: "Highway 20",
    city: "Thorold",
    intro: {
      en: "The Highway 20 bridge crosses the Welland Canal at Allanburg, in Thorold just south of St. Catharines. It's Bridge 11, a vertical-lift bridge from around 1930 that raises its deck for passing ships. In 2001 the laker Windoc was struck by the lowering span here, and the crossing stayed shut for months while it was rebuilt.",
      fr: "Le pont de la Highway 20 traverse le canal Welland à Allanburg, à Thorold, juste au sud de St. Catharines. C'est le pont 11, un pont levant des années 1930 qui hisse son tablier au passage des navires. En 2001, le laquier Windoc a heurté le tablier qui s'abaissait, et le pont est resté fermé des mois, le temps d'être reconstruit.",
      es: "El puente de la Highway 20 cruza el canal Welland en Allanburg, en Thorold, justo al sur de St. Catharines. Es el puente 11, de elevación vertical y de hacia 1930, que levanta su tablero al paso de los barcos. En 2001 el granelero Windoc chocó con el tablero mientras bajaba, y el cruce quedó cerrado durante meses mientras se reconstruía.",
    },
  },
  "main-st": {
    name: "Main St",
    intro: {
      en: "Main Street, Regional Road 3, is the main crossing of the Welland Canal in Port Colborne, near the Lake Erie end where ships finish the canal. It's Bridge 19, a bascule that tips its deck up on a counterweight. A 2015 collision with a cargo ship shut it for a while as crews checked the damage.",
      fr: "Main Street, la route régionale 3, est le principal passage du canal Welland à Port Colborne, près de l'extrémité du lac Érié où les navires terminent le canal. C'est le pont 19, un pont basculant qui relève son tablier sur un contrepoids. Une collision avec un cargo en 2015 l'a fermé un temps, le temps d'évaluer les dégâts.",
      es: "Main Street, la carretera regional 3, es el cruce principal del canal Welland en Port Colborne, cerca del extremo del lago Erie donde los barcos terminan el canal. Es el puente 19, basculante, que levanta el tablero sobre un contrapeso. Un choque con un carguero en 2015 lo cerró un tiempo mientras se evaluaban los daños.",
    },
  },
  "mellanby-ave": {
    name: "Mellanby Ave",
    intro: {
      en: "Mellanby Avenue crosses the Welland Canal in Port Colborne as Bridge 19A, a short way from the Main Street crossing. It's a bascule, and it's the one drivers fall back on when Main Street is up or out of service. Both sit near Lock 8 at the canal's south end.",
      fr: "Mellanby Avenue traverse le canal Welland à Port Colborne : c'est le pont 19A, à deux pas du passage de Main Street. C'est un pont basculant, celui sur lequel on se rabat quand Main Street est levé ou hors service. Les deux se trouvent près de l'écluse 8, au sud du canal.",
      es: "Mellanby Avenue cruza el canal Welland en Port Colborne: es el puente 19A, muy cerca del cruce de Main Street. Es basculante, y es el cruce alternativo cuando Main Street está levantado o fuera de servicio. Ambos están junto a la esclusa 8, en el extremo sur del canal.",
    },
  },
  "clarence-st": {
    name: "Clarence St",
    intro: {
      en: "Clarence Street crosses the Welland Canal near the Lake Erie end in Port Colborne. It's Bridge 21, a vertical-lift bridge built in the late 1920s when the current canal was dug, and one of only a handful of lift bridges still working on it. The deck rises straight up to let ships pass.",
      fr: "Clarence Street traverse le canal Welland près de l'extrémité du lac Érié, à Port Colborne. C'est le pont 21, un pont levant construit à la fin des années 1920, à l'époque du creusement du canal actuel, et l'un des rares ponts levants encore en service. Le tablier monte à la verticale pour laisser passer les navires.",
      es: "Clarence Street cruza el canal Welland cerca del extremo del lago Erie, en Port Colborne. Es el puente 21, de elevación vertical, construido a finales de los años 1920 cuando se excavó el canal actual, y uno de los pocos puentes elevadores que siguen funcionando. El tablero sube en vertical para dejar pasar los barcos.",
    },
  },
  victoria: {
    name: "Victoria",
    city: "Montréal",
    spans: [
      {
        apiId: "MSS_VictoriaBridgeDownstream",
        label: { en: "Road bridge", fr: "Pont routier", es: "Puente vial" },
      },
      {
        apiId: "MSS_VictoriaBridgeUpstreamCyc",
        label: {
          en: "Cycling & pedestrian path",
          fr: "Piste cyclable et piétonne",
          es: "Carril para ciclistas y peatones",
        },
      },
    ],
    intro: {
      en: "The Victoria Bridge links Montréal to Saint-Lambert across the St. Lawrence, carrying Route 112 and trains, with a separate cycling and pedestrian path on the upstream side. When it opened in 1859 it was the only bridge across the river, and at nearly two kilometres it's still one of the longest. Where it crosses the Seaway the deck opens for ships, which can hold up the road and the path alike. Bridge Up tracks both below.",
      fr: "Le pont Victoria relie Montréal à Saint-Lambert par-dessus le Saint-Laurent et porte la route 112 ainsi que des trains, avec une piste cyclable et piétonne du côté amont. À son ouverture en 1859, c'était le seul pont à franchir le fleuve, et avec près de deux kilomètres, il reste l'un des plus longs. Là où il croise la Voie maritime, le tablier s'ouvre pour les navires, ce qui peut bloquer la route comme la piste. Bridge Up suit les deux ci-dessous.",
      es: "El puente Victoria une Montreal con Saint-Lambert sobre el San Lorenzo y lleva la ruta 112 además de trenes, con un carril para ciclistas y peatones en el lado de aguas arriba. Cuando se inauguró en 1859 era el único puente sobre el río, y con casi dos kilómetros sigue siendo uno de los más largos. Donde cruza la vía marítima, el tablero se abre para los barcos, lo que puede frenar tanto la carretera como el carril; Bridge Up sigue ambos abajo.",
    },
  },
  "sainte-catherine-recreoparc": {
    name: "Sainte-Catherine / RécréoParc",
    city: "Sainte-Catherine",
    intro: {
      en: "This lift bridge sits at the Côte-Sainte-Catherine lock in Sainte-Catherine, on the South Shore stretch of the St. Lawrence Seaway. It's best known as the way into the RécréoParc waterfront park. When a ship works through the lock, the span lifts and the crossing closes for a while.",
      fr: "Ce pont levant se trouve à l'écluse de Côte-Sainte-Catherine, à Sainte-Catherine, sur la portion rive-sud de la Voie maritime du Saint-Laurent. On le connaît surtout comme l'accès au parc riverain du RécréoParc. Quand un navire franchit l'écluse, la travée se lève et le passage se ferme un moment.",
      es: "Este puente de elevación vertical está en la esclusa de Côte-Sainte-Catherine, en Sainte-Catherine, en el tramo de la orilla sur de la vía marítima del San Lorenzo. Se le conoce sobre todo como el acceso al parque ribereño del RécréoParc. Cuando un barco pasa por la esclusa, el tramo se levanta y el cruce se cierra un rato.",
    },
  },
  "st-louis-de-gonzague": {
    name: "Saint-Louis-de-Gonzague",
    city: "Saint-Louis-de-Gonzague",
    intro: {
      en: "The Saint-Louis-de-Gonzague bridge carries Rue du Pont over the Beauharnois Canal, the Seaway channel that runs through the Suroît region southwest of Montréal. The approaches date to 1932; the vertical-lift span in the middle was added in 1957 for the Seaway. That centre span rises for passing ships.",
      fr: "Le pont Saint-Louis-de-Gonzague porte la rue du Pont au-dessus du canal de Beauharnois, le chenal de la Voie maritime qui traverse le Suroît, au sud-ouest de Montréal. Les approches datent de 1932; la travée levante centrale a été ajoutée en 1957 pour la Voie maritime. C'est cette travée du centre qui se lève au passage des navires.",
      es: "El puente Saint-Louis-de-Gonzague lleva la rue du Pont sobre el canal de Beauharnois, el cauce de la vía marítima que atraviesa la región del Suroît, al suroeste de Montreal. Los accesos son de 1932; el tramo central de elevación vertical se añadió en 1957 para la vía marítima. Ese tramo central se levanta al paso de los barcos.",
    },
  },
  larocque: {
    name: "Larocque",
    city: "Salaberry-de-Valleyfield",
    intro: {
      en: "The Larocque Bridge connects Salaberry-de-Valleyfield to Saint-Stanislas-de-Kostka across the Beauharnois Canal, carrying Route 201 and a rail line on the same deck. It's a vertical-lift bridge; the centre span, added in 1957, lifts for ships on the Seaway. End to end it runs close to a kilometre.",
      fr: "Le pont Larocque relie Salaberry-de-Valleyfield à Saint-Stanislas-de-Kostka par-dessus le canal de Beauharnois, en portant la route 201 et une voie ferrée sur le même tablier. C'est un pont levant : la travée centrale, ajoutée en 1957, se lève pour les navires de la Voie maritime. D'un bout à l'autre, il fait près d'un kilomètre.",
      es: "El puente Larocque une Salaberry-de-Valleyfield con Saint-Stanislas-de-Kostka sobre el canal de Beauharnois, llevando la ruta 201 y una vía férrea en el mismo tablero. Es de elevación vertical: el tramo central, añadido en 1957, se levanta para los barcos de la vía marítima. De extremo a extremo mide casi un kilómetro.",
    },
  },
};

export function getBridgeEditorial(
  slug: string,
  locale: Locale
):
  | { name: string; city?: string; intro?: string; spans?: { apiId: string; label: string }[] }
  | undefined {
  const c = BRIDGE_CONTENT[slug];
  if (!c) return undefined;
  return {
    name: c.name,
    city: c.city,
    intro: c.intro[locale] ?? c.intro.en,
    spans: c.spans?.map((s) => ({ apiId: s.apiId, label: s.label[locale] ?? s.label.en ?? "" })),
  };
}

// Slugs with reviewed editorial content (drives which bridge pages get generated).
export function editorialSlugs(): string[] {
  return Object.keys(BRIDGE_CONTENT);
}
