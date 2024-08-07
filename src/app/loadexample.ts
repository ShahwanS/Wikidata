import { Property, getPropertyByName } from "./propgliederung";

function createExampleField(propName: string, exampleValues: string[]): Property {
      return({...getPropertyByName(propName), value: exampleValues})
}

export function exampleFields(): Property[] {
  const example : Property[] = []
  example.push(
    // Initial fields
    {...getPropertyByName("Offizieller Name"), value: ["Marburger Landgrafenschloss"], category: "",required:true},
    {...getPropertyByName("Datum der offiziellen Eröffnung"), value: ["1138 oder 1139"], category: "",required:true},
    {...getPropertyByName("Bild"), category: "",value:[""],required:true},
    {...getPropertyByName("Webseite"), value:["https://www.uni-marburg.de/de/museum/landgrafenschloss","https://www.marburg.de/portal/seiten/landgrafenschloss-900000041-23001.html"], category: "",required:true},

    createExampleField("Kurzname",["MR Schloss","Marburger Schloss","Schloss"]),
    createExampleField("Baujahr",["11. Jahrhundert"]),
    createExampleField("Schlüsselperson",["Landgraf Philipp"]),
    createExampleField("Breite",["200"]),
    createExampleField("Länge",["80"]),
    createExampleField("Enthält",["Fürstensaal", "Großer Saal","Schlosskapelle"]),
    createExampleField("Angrenzende Gebäude",["Hexenturm", "Bückingsgarten"]),
    createExampleField("Blickrichtung",["Süden"]),
    createExampleField("Rollstuhl geeignet",[""]),
    createExampleField("Koordinaten",["50°48'36.7\"N, 8°46'1.2\"E"]),
    getPropertyByName("Land"),
    getPropertyByName("Zeitzone"),
    getPropertyByName("Baumaterial"),
    createExampleField("Komplette Adresse",["Schloss 1"]),
    createExampleField("Postleitzahl",["35037"]),
    createExampleField("Architekturstil",["gotische Säle",""]),
    createExampleField("Verwendungszweck",["festliche und kulturelle Anlässe","Museum"]),
    createExampleField("Anzahl an Fahrstühlen",["0"]),
    createExampleField("Ist Instanz von",["Gebäude","Schloss","Burg"]),
    createExampleField("Erhaltungszustand",[""])   
  )
  return(example)
}

export function exampleRichtexts(
  setRichTextTitle: React.Dispatch<React.SetStateAction<{[key: string]: string;}>>,
  setRichTextState: React.Dispatch<React.SetStateAction<{[key: string]: string;}>>
) {
  const exampleRichtextTitles: { [key: string]: string } = {};
  exampleRichtextTitles["Rich Text0"] = "Öffnungszeiten des Museums"
  setRichTextTitle(exampleRichtextTitles)
  const exampleRichtexts: { [key: string]: string } = {};
  exampleRichtexts["Rich Text0"] = "<h2><u>Das Museum hat folgende Öffnungszeiten</u></h2><ul><li>Montags <strong>geschlossen</strong></li><li>April bis Oktober: Dienstag bis Sonntag 10–18 Uhr</li><li>November bis März: Dienstag bis Sonntag 10–16 Uhr</li><li>An und nach Feiertagen: Sonderregelung</li></ul><p><br></p><p><a href=\"https://www.marburg.de/portal/seiten/landgrafenschloss-900000041-23001.html\" rel=\"noopener noreferrer\" target=\"_blank\">Hier</a> nachzulesen</p>"
  exampleRichtexts["Rich Text1"] = "<h2><u>Bedeutung und heutige Nutzung der Anlage</u></h2><p>Neben seiner historischen Bedeutung als erste Residenz der <a href=\"test\" rel=\"noopener noreferrer\" target=\"_blank\">Landgrafschaft Hessen</a> ist das Schloss von großem kunst- bzw. bauhistorischem Interesse. Dies betrifft neben den Bauteilen aus dem 11./12. Jahrhundert vor allem die Burg aus der zweiten Hälfte des 13. Jahrhunderts, die noch heute den Gesamteindruck der Anlage wesentlich bestimmt. Die Schlosskapelle und der <a href=\"test\" rel=\"noopener noreferrer\" target=\"_blank\">Saalbau</a> mit dem <em>Großen Saal</em> bzw. <em>Fürstensaal</em>, der zu den größten und qualitätvollsten profanen gotischen Sälen in Mitteleuropa gehört, sind herausragende Leistungen der europäischen Burgenarchitektur.</p><p>Heute wird das Schloss in Teilen vom <a href=\"test\" rel=\"noopener noreferrer\" target=\"_blank\">Marburger Universitätsmuseum</a> für Kulturgeschichte im Wilhelmsbau und für kulturelle Veranstaltungen, wie z. B. für Theateraufführungen des Hessischen Landestheaters im Fürstensaal genutzt. Eine Besichtigung der Anlage ist möglich. Im Rahmen von Führungen können die Kasematten beim Schloss sowie der Hexenturm besichtigt werden. Die Nebengebäude Marstall, Zeughaus sowie die ehemalige Schmiede beherbergen seit 1946 das Collegium Philippinum der <a href=\"test\" rel=\"noopener noreferrer\" target=\"_blank\">Hessischen Stipendiatenanstalt</a>.</p><p><br></p><h2><strong><em><u>Außerdem</u></em></strong>:</h2><ol><li>Schrift ist <em>kursiv</em></li><li><strong>FETT</strong></li></ol><p><br></p>"
  setRichTextState(exampleRichtexts)
}
