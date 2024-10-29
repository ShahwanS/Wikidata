import { Property } from '@/types/property';

function createExampleField(
  propName: string,
  exampleValues: string[],
  getPropertyByName: (propName: string) => Property,
): Property {
  return { ...getPropertyByName(propName), value: exampleValues };
}

export function exampleFields(getPropertyByName: (propName: string) => Property): Property[] {
  const example: Property[] = [];

  example.push(
    {
      ...getPropertyByName('Official Name'),
      value: ['Marburg Landgrave Castle'],
      category: '',
      required: true,
    },
    {
      ...getPropertyByName('Official Opening Date'),
      value: ['1138 or 1139'],
      category: '',
      required: true,
    },
    {
      ...getPropertyByName('Image'),
      category: '',
      value: [''],
      required: true,
    },
    {
      ...getPropertyByName('Website'),
      value: [
        'https://www.uni-marburg.de/en/museum/landgrave-castle',
        'https://www.marburg.de/portal/pages/landgrave-castle-900000041-23001.html',
      ],
      category: '',
      required: true,
    },
    createExampleField('Short Name', ['MR Castle', 'Marburg Castle', 'Castle'], getPropertyByName),
    createExampleField('Year Built', ['11th Century'], getPropertyByName),
    createExampleField('Key Person', ['Landgrave Philip'], getPropertyByName),
    createExampleField('Width', ['200'], getPropertyByName),
    createExampleField('Length', ['80'], getPropertyByName),
    createExampleField(
      'Contains',
      ["Prince's Hall", 'Great Hall', 'Castle Chapel'],
      getPropertyByName,
    ),
    createExampleField(
      'Adjacent Buildings',
      ["Witch's Tower", "Bücking's Garden"],
      getPropertyByName,
    ),
    createExampleField('Orientation', ['South'], getPropertyByName),
    createExampleField('Wheelchair Accessible', [''], getPropertyByName),
    createExampleField('Coordinates', ['50°48\'36.7"N, 8°46\'1.2"E'], getPropertyByName),
    getPropertyByName('Building Materials'),
    createExampleField('Full Address', ['Castle 1'], getPropertyByName),
    createExampleField('Postal Code', ['35037'], getPropertyByName),
    createExampleField('Architectural Style', ['Gothic Halls', ''], getPropertyByName),
    createExampleField('Purpose', ['Festive and Cultural Events', 'Museum'], getPropertyByName),
    createExampleField('Number of Elevators', ['0'], getPropertyByName),
    createExampleField('Instance of', ['Building', 'Castle', 'Fortress'], getPropertyByName),
    createExampleField('Preservation Status', [''], getPropertyByName),
  );

  return example;
}

export function exampleSources(): Record<string, string> {
  return {
    P1448: 'Official city records of Marburg, 2023',
    P1619: "Marburg Historical Society, 'Castle Chronicles', 2020",
    P856: 'Official websites of Marburg University and City of Marburg, accessed 2023',
    P742: 'Local usage and tourism brochures, 2023',
    P571: 'Archaeological studies, University of Marburg, 2018',
    P3342: "Hessian State Archives, 'Landgraves of Hesse', 2015",
    // Add more example sources as needed
  };
}

export function exampleRichtexts(
  setRichTextTitle: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setRichTextState: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
) {
  const exampleRichtextTitles: { [key: string]: string } = {};
  exampleRichtextTitles['Rich Text0'] = 'Museum Opening Hours';
  exampleRichtextTitles['Rich Text1'] = 'Historical and Current Use of the Castle';
  setRichTextTitle(exampleRichtextTitles);

  const exampleRichtexts: { [key: string]: string } = {};
  exampleRichtexts['Rich Text0'] =
    '<h2><u>The museum has the following opening hours</u></h2><ul><li>Closed on Mondays</li><li>April to October: Tuesday to Sunday 10–18</li><li>November to March: Tuesday to Sunday 10–16</li><li>Special regulations on holidays</li></ul><p><br></p><p><a href="https://www.marburg.de/portal/pages/landgrave-castle-900000041-23001.html" rel="noopener noreferrer" target="_blank">Read more here</a></p>';
  exampleRichtexts['Rich Text1'] =
    '<h2><u>Historical and Current Use of the Castle</u></h2><p>Besides its historical significance as the first residence of the <a href="test" rel="noopener noreferrer" target="_blank">Landgraviate of Hesse</a>, the castle is of major artistic and architectural interest. This applies to parts of the building dating from the 11th/12th century as well as the castle from the second half of the 13th century, which still characterizes the complex today. The Castle Chapel and the <a href="test" rel="noopener noreferrer" target="_blank">Great Hall</a>, one of the largest and finest secular Gothic halls in Central Europe, are outstanding achievements of European castle architecture.</p><p>Today, parts of the castle house the <a href="test" rel="noopener noreferrer" target="_blank">Marburg University Museum</a> for cultural history and are used for cultural events, such as theatrical performances in the Prince\'s Hall by the Hessian State Theatre. The castle can be visited, and guided tours of the casemates and Witch\'s Tower are available. The outbuildings, including the Marstall and the former smithy, have housed the Collegium Philippinum of the <a href="test" rel="noopener noreferrer" target="_blank">Hessian Scholarship Institution</a> since 1946.</p>';
  setRichTextState(exampleRichtexts);
}
