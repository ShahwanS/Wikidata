import { Property } from "@/types/property";

function createExampleField(
  propName: string,
  exampleValues: string[],
  getPropertyByName: (propName: string) => Property
): Property {
  return { ...getPropertyByName(propName), value: exampleValues };
}

export function exampleFields(
  getPropertyByName: (propName: string) => Property
): Property[] {
  const example: Property[] = [];

  example.push(
    {
      ...getPropertyByName("Offizieller Name"),
      value: ["Marburger Landgrafenschloss"],
      category: "",
      required: true,
    },
    {
      ...getPropertyByName("Datum der offiziellen Eröffnung"),
      value: ["1138 oder 1139"],
      category: "",
      required: true,
    },
    { ...getPropertyByName("Bild"), category: "", value: [""], required: true },
    {
      ...getPropertyByName("Webseite"),
      value: [
        "https://www.uni-marburg.de/de/museum/landgrafenschloss",
        "https://www.marburg.de/portal/seiten/landgrafenschloss-900000041-23001.html",
      ],
      category: "",
      required: true,
    },

    createExampleField(
      "Kurzname",
      ["MR Schloss", "Marburger Schloss", "Schloss"],
      getPropertyByName
    ),
    createExampleField("Baujahr", ["11. Jahrhundert"], getPropertyByName),
    createExampleField(
      "Schlüsselperson",
      ["Landgraf Philipp"],
      getPropertyByName
    ),
    createExampleField("Breite", ["200"], getPropertyByName),
    createExampleField("Länge", ["80"], getPropertyByName),
    createExampleField(
      "Enthält",
      ["Fürstensaal", "Großer Saal", "Schlosskapelle"],
      getPropertyByName
    ),
    createExampleField(
      "Angrenzende Gebäude",
      ["Hexenturm", "Bückingsgarten"],
      getPropertyByName
    ),
    createExampleField("Blickrichtung", ["Süden"], getPropertyByName),
    createExampleField("Rollstuhl geeignet", [""], getPropertyByName),
    createExampleField(
      "Koordinaten",
      ["50°48'36.7\"N, 8°46'1.2\"E"],
      getPropertyByName
    ),
    getPropertyByName("Land"),
    getPropertyByName("Zeitzone"),
    getPropertyByName("Baumaterial"),
    createExampleField("Komplette Adresse", ["Schloss 1"], getPropertyByName),
    createExampleField("Postleitzahl", ["35037"], getPropertyByName),
    createExampleField(
      "Architekturstil",
      ["gotische Säle", ""],
      getPropertyByName
    ),
    createExampleField(
      "Verwendungszweck",
      ["festliche und kulturelle Anlässe", "Museum"],
      getPropertyByName
    ),
    createExampleField("Anzahl an Fahrstühlen", ["0"], getPropertyByName),
    createExampleField(
      "Ist Instanz von",
      ["Gebäude", "Schloss", "Burg"],
      getPropertyByName
    ),
    createExampleField("Erhaltungszustand", [""], getPropertyByName)
  );

  return example;
}

export function exampleSources(): Record<string, string> {
  return {
    P1448: "Stadtarchiv Marburg, 2023",
    P1619: "Marburger Burgenkunde, 2020",
    P856: "Offizielle Websites von Marburg University und der Stadt Marburg, 2023",
    P742: "Lokale Verwendung und Tourismusbroschüren, 2023",
    P571: "Archäologische Studien, Universität Marburg, 2018",
    P3342: "Hessische Landesarchiv, 'Landgrafen von Hessen', 2015",
    // Add more example sources as needed
  };
}

export function exampleRichtexts(
  setRichTextTitle: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >,
  setRichTextState: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >
) {
  const exampleRichtextTitles: { [key: string]: string } = {};
  exampleRichtextTitles["Rich Text0"] = "Öffnungszeiten des Museums";
  setRichTextTitle(exampleRichtextTitles);
  const exampleRichtexts: { [key: string]: string } = {};
  exampleRichtexts["Rich Text0"] =
    '<h2><u>Das Museum hat folgende Öffnungszeiten</u></h2><ul><li>Montags <strong>geschlossen</strong></li><li>April bis Oktober: Dienstag bis Sonntag 10–18 Uhr</li><li>November bis März: Dienstag bis Sonntag 10–16 Uhr</li><li>An und nach Feiertagen: Sonderregelung</li></ul><p><br></p><p><a href="https://www.marburg.de/portal/seiten/landgrafenschloss-900000041-23001.html" rel="noopener noreferrer" target="_blank">Hier</a> nachzulesen</p>';
  exampleRichtexts["Rich Text1"] =
    '<h2><u>Bedeutung und heutige Nutzung der Anlage</u></h2><p>Neben seiner historischen Bedeutung als erste Residenz der <a href="test" rel="noopener noreferrer" target="_blank">Landgrafschaft Hessen</a> ist das Schloss von großem kunst- bzw. bauhistorischem Interesse. Dies betrifft neben den Bauteilen aus dem 11./12. Jahrhundert vor allem die Burg aus der zweiten Hälfte des 13. Jahrhunderts, die noch heute den Gesamteindruck der Anlage wesentlich bestimmt. Die Schlosskapelle und der <a href="test" rel="noopener noreferrer" target="_blank">Saalbau</a> mit dem <em>Großen Saal</em> bzw. <em>Fürstensaal</em>, der zu den größten und qualitätvollsten profanen gotischen Sälen in Mitteleuropa gehört, sind herausragende Leistungen der europäischen Burgenarchitektur.</p><p>Heute wird das Schloss in Teilen vom <a href="test" rel="noopener noreferrer" target="_blank">Marburger Universitätsmuseum</a> für Kulturgeschichte im Wilhelmsbau und für kulturelle Veranstaltungen, wie z. B. für Theateraufführungen des Hessischen Landestheaters im Fürstensaal genutzt. Eine Besichtigung der Anlage ist möglich. Im Rahmen von Führungen können die Kasematten beim Schloss sowie der Hexenturm besichtigt werden. Die Nebengebäude Marstall, Zeughaus sowie die ehemalige Schmiede beherbergen seit 1946 das Collegium Philippinum der <a href="test" rel="noopener noreferrer" target="_blank">Hessischen Stipendiatenanstalt</a>.</p><p><br></p><h2><strong><em><u>Außerdem</u></em></strong>:</h2><ol><li>Schrift ist <em>kursiv</em></li><li><strong>FETT</strong></li></ol><p><br></p>';
  setRichTextState(exampleRichtexts);
}
