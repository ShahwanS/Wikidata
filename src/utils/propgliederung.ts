import { Category } from '@/types/category';

/** Porperties-Gliederung
 *  (orientiert sich an der Pdf-Datei)
 */
/** Main function that defines the structure of categories and properties with i18n */
export const propgliederung = (t: (key: string) => string): Category[] => [
  {
    title: t('building.title'),
    description: t('building.description'),
    subcategories: [
      {
        name: t('building.dimensions.title'),
        description: t('building.dimensions.description'),
        properties: [
          {
            name: t('building.dimensions.height.label'),
            type: 'number',
            wikidataprop: 'P2048',
            unique: true,
            unit: ['Meter'],
            placeholder: t('building.dimensions.height.placeholder'),
            infobox: t('building.dimensions.height.infobox'),
          },
          {
            name: t('building.dimensions.length.label'),
            type: 'number',
            wikidataprop: 'P2043',
            unique: true,
            unit: ['Meter'],
            placeholder: t('building.dimensions.length.placeholder'),
            infobox: t('building.dimensions.length.infobox'),
          },
          {
            name: t('building.dimensions.width.label'),
            type: 'number',
            wikidataprop: 'P2049',
            unique: true,
            unit: ['Meter'],
            placeholder: t('building.dimensions.width.placeholder'),
            infobox: t('building.dimensions.width.infobox'),
          },
        ],
      },
      {
        name: t('building.areas.title'),
        description: t('building.areas.description'),
        properties: [
          {
            name: t('building.areas.groundArea.label'),
            type: 'number',
            wikidataprop: 'P2046',
            unique: true,
            unit: ['Quadratmeter'],
            placeholder: t('building.areas.groundArea.placeholder'),
            infobox: t('building.areas.groundArea.infobox'),
          },
        ],
      },
      {
        name: t('building.floors.title'),
        description: t('building.floors.description'),
        properties: [
          {
            name: t('building.floors.aboveGround.label'),
            type: 'number',
            wikidataprop: 'P1101',
            unique: true,
            placeholder: t('building.floors.aboveGround.placeholder'),
            infobox: t('building.floors.aboveGround.infobox'),
          },
          {
            name: t('building.floors.belowGround.label'),
            type: 'number',
            wikidataprop: 'P1139',
            unique: true,
            placeholder: t('building.floors.belowGround.placeholder'),
            infobox: t('building.floors.belowGround.infobox'),
          },
          {
            name: t('building.floors.elevators.label'),
            type: 'number',
            wikidataprop: 'P1301',
            unique: true,
            placeholder: t('building.floors.elevators.placeholder'),
            infobox: t('building.floors.elevators.infobox'),
          },
        ],
      },
      {
        name: t('building.rooms.title'),
        description: t('building.rooms.description'),
        properties: [
          {
            name: t('building.rooms.roomCount.label'),
            type: 'number',
            wikidataprop: 'P8733',
            unique: true,
            placeholder: t('building.rooms.roomCount.placeholder'),
            infobox: t('building.rooms.roomCount.infobox'),
          },
          {
            name: t('building.rooms.partOf.label'),
            type: 'text',
            wikidataprop: 'P361',
            placeholder: t('building.rooms.partOf.placeholder'),
            infobox: t('building.rooms.partOf.infobox'),
          },
          {
            name: t('building.rooms.contains.label'),
            type: 'text',
            wikidataprop: 'P527',
            placeholder: t('building.rooms.contains.placeholder'),
            infobox: t('building.rooms.contains.infobox'),
          },
        ],
      },
      {
        name: t('building.accessibility.title'),
        description: t('building.accessibility.description'),
        properties: [
          {
            name: t('building.accessibility.wheelchairAccessible.label'),
            type: 'radio',
            wikidataprop: 'P2846',
            choices: [
              t('building.accessibility.wheelchairAccessible.choices.veryAccessible'),
              t('building.accessibility.wheelchairAccessible.choices.partiallyAccessible'),
              t('building.accessibility.wheelchairAccessible.choices.notAccessible'),
            ],
            unique: true,
            placeholder: t('building.accessibility.wheelchairAccessible.placeholder'),
            infobox: t('building.accessibility.wheelchairAccessible.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('nameDetails.title'),
    description: t('nameDetails.description'),
    subcategories: [
      {
        name: t('nameDetails.title'),
        description: t('nameDetails.description'),
        properties: [
          {
            name: t('nameDetails.officialName.label'),
            type: 'text',
            wikidataprop: 'P1448',
            unique: true,
            placeholder: t('nameDetails.officialName.placeholder'),
            required: true,
            infobox: t('nameDetails.officialName.infobox'),
          },
          {
            name: t('nameDetails.shortName.label'),
            type: 'text',
            wikidataprop: 'P1813',
            placeholder: t('nameDetails.shortName.placeholder'),
            infobox: t('nameDetails.shortName.infobox'),
          },
          {
            name: t('nameDetails.nickname.label'),
            type: 'text',
            wikidataprop: 'P1449',
            placeholder: t('nameDetails.nickname.placeholder'),
            infobox: t('nameDetails.nickname.infobox'),
          },
          {
            name: t('nameDetails.namesake.label'),
            type: 'text',
            wikidataprop: 'P138',
            placeholder: t('nameDetails.namesake.placeholder'),
            infobox: t('nameDetails.namesake.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('architectureDetails.title'),
    description: t('architectureDetails.description'),
    subcategories: [
      {
        name: t('architectureDetails.title'),
        description: t('architectureDetails.description'),
        properties: [
          {
            name: t('architectureDetails.style.label'),
            type: 'text',
            wikidataprop: 'P149',
            placeholder: t('architectureDetails.style.placeholder'),
            infobox: t('architectureDetails.style.infobox'),
          },
          {
            name: t('architectureDetails.inspiredBy.label'),
            type: 'text',
            wikidataprop: 'P941',
            placeholder: t('architectureDetails.inspiredBy.placeholder'),
            infobox: t('architectureDetails.inspiredBy.infobox'),
          },
          {
            name: t('architectureDetails.architect.label'),
            type: 'text',
            wikidataprop: 'P84',
            placeholder: t('architectureDetails.architect.placeholder'),
            infobox: t('architectureDetails.architect.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('constructionDetails.title'),
    description: t('constructionDetails.description'),
    subcategories: [
      {
        name: t('constructionDetails.title'),
        description: t('constructionDetails.description'),
        properties: [
          {
            name: t('constructionDetails.materials.label'),
            type: 'text',
            wikidataprop: 'P186',
            placeholder: t('constructionDetails.materials.placeholder'),
            infobox: t('constructionDetails.materials.infobox'),
          },
          {
            name: t('constructionDetails.method.label'),
            type: 'text',
            wikidataprop: 'P2079',
            placeholder: t('constructionDetails.method.placeholder'),
            infobox: t('constructionDetails.method.infobox'),
          },
          {
            name: t('constructionDetails.company.label'),
            type: 'text',
            wikidataprop: 'P193',
            placeholder: t('constructionDetails.company.placeholder'),
            infobox: t('constructionDetails.company.infobox'),
          },

          {
            name: t('constructionDetails.engineer.label'),
            type: 'text',
            wikidataprop: 'P631',
            placeholder: t('constructionDetails.engineer.placeholder'),
            infobox: t('constructionDetails.engineer.infobox'),
          },
          {
            name: t('constructionDetails.cost.label'),
            type: 'number',
            description: t('constructionDetails.cost.description'),
            wikidataprop: 'P2130',
            unique: true,
            unit: ['EUR', 'D-Mark', 'Mark', 'Thaler'],
            placeholder: t('constructionDetails.cost.placeholder'),
            infobox: t('constructionDetails.cost.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('geographicDetails.title'),
    description: t('geographicDetails.description'),
    subcategories: [
      {
        name: t('geographicDetails.location.label'),
        description: t('geographicDetails.location.description'),
        properties: [
          {
            name: t('geographicDetails.location.adjacentBuildings.label'),
            type: 'text',
            wikidataprop: 'P3032',
            placeholder: t('geographicDetails.location.adjacentBuildings.placeholder'),
            infobox: t('geographicDetails.location.adjacentBuildings.infobox'),
          },
          {
            name: t('geographicDetails.location.connectedTo.label'),
            type: 'text',
            wikidataprop: 'P2789',
            placeholder: t('geographicDetails.location.connectedTo.placeholder'),
            infobox: t('geographicDetails.location.connectedTo.infobox'),
          },
          {
            name: t('geographicDetails.location.coordinates.label'),
            type: 'text',
            wikidataprop: 'P625',
            unique: true,
            placeholder: t('geographicDetails.location.coordinates.placeholder'),
            infobox: t('geographicDetails.location.coordinates.infobox'),
          },

          {
            name: t('geographicDetails.location.orientation.label'),
            type: 'text',
            wikidataprop: 'P7787',
            unique: true,
            placeholder: t('geographicDetails.location.orientation.placeholder'),
            infobox: t('geographicDetails.location.orientation.infobox'),
          },
        ],
      },
      {
        name: t('geographicDetails.address.label'),
        description: t('geographicDetails.address.description'),
        properties: [
          {
            name: t('geographicDetails.address.street.label'),
            type: 'text',
            wikidataprop: 'P669',
            unique: true,
            placeholder: t('geographicDetails.address.street.placeholder'),
            infobox: t('geographicDetails.address.street.infobox'),
          },
          {
            name: t('geographicDetails.address.fullAddress.label'),
            type: 'text',
            wikidataprop: 'P6375',
            unique: true,
            placeholder: t('geographicDetails.address.fullAddress.placeholder'),
            infobox: t('geographicDetails.address.fullAddress.infobox'),
          },
          {
            name: t('geographicDetails.address.postalCode.label'),
            type: 'text',
            wikidataprop: 'P281',
            unique: true,
            placeholder: t('geographicDetails.address.postalCode.placeholder'),
            infobox: t('geographicDetails.address.postalCode.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('historicalData.title'),
    description: t('historicalData.description'),
    subcategories: [
      {
        name: t('historicalData.title'),
        description: t('historicalData.description'),
        properties: [
          {
            name: t('historicalData.yearBuilt.label'),
            type: 'text',
            wikidataprop: 'P571',
            unique: true,
            placeholder: t('historicalData.yearBuilt.placeholder'),
            infobox: t('historicalData.yearBuilt.infobox'),
          },
          {
            name: t('historicalData.openingDate.label'),
            type: 'text',
            wikidataprop: 'P1619',
            unique: true,
            placeholder: t('historicalData.openingDate.placeholder'),
            infobox: t('historicalData.openingDate.infobox'),
          },
          {
            name: t('historicalData.closingDate.label'),
            type: 'text',
            wikidataprop: 'P3999',
            unique: true,
            placeholder: t('historicalData.closingDate.placeholder'),
            infobox: t('historicalData.closingDate.infobox'),
          },
          {
            name: t('historicalData.demolitionDate.label'),
            type: 'text',
            wikidataprop: 'P576',
            unique: true,
            placeholder: t('historicalData.demolitionDate.placeholder'),
            infobox: t('historicalData.demolitionDate.infobox'),
          },
          {
            name: t('historicalData.keyEvent.label'),
            type: 'text',
            wikidataprop: 'P793',
            placeholder: t('historicalData.keyEvent.placeholder'),
            infobox: t('historicalData.keyEvent.infobox'),
          },
          {
            name: t('historicalData.keyPerson.label'),
            type: 'text',
            wikidataprop: 'P3342',
            placeholder: t('historicalData.keyPerson.placeholder'),
            infobox: t('historicalData.keyPerson.infobox'),
          },
          {
            name: t('historicalData.contractor.label'),
            type: 'text',
            wikidataprop: 'P88',
            placeholder: t('historicalData.contractor.placeholder'),
            infobox: t('historicalData.contractor.infobox'),
          },

          {
            name: t('historicalData.predecessor.label'),
            type: 'text',
            wikidataprop: 'P1398',
            placeholder: t('historicalData.predecessor.placeholder'),
            infobox: t('historicalData.predecessor.infobox'),
          },
          {
            name: t('historicalData.successor.label'),
            type: 'text',
            wikidataprop: 'P167',
            placeholder: t('historicalData.successor.placeholder'),
            infobox: t('historicalData.successor.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('usage.title'),
    description: t('usage.description'),
    subcategories: [
      {
        name: t('usage.state.label'),
        description: t('usage.description'),
        properties: [
          {
            name: t('usage.state.label'),
            type: 'text',
            wikidataprop: 'P5817',
            unique: true,
            placeholder: t('usage.state.placeholder'),
            infobox: t('usage.state.infobox'),
          },
          {
            name: t('usage.condition.label'),
            type: 'text',
            wikidataprop: 'P5816',
            unique: true,
            placeholder: t('usage.condition.placeholder'),
            infobox: t('usage.condition.infobox'),
          },
          {
            name: t('usage.user.label'),
            type: 'text',
            wikidataprop: 'P466',
            placeholder: t('usage.user.placeholder'),
            infobox: t('usage.user.infobox'),
          },
          {
            name: t('usage.purpose.label'),
            type: 'text',
            wikidataprop: 'P366',
            placeholder: t('usage.purpose.placeholder'),
            infobox: t('usage.purpose.infobox'),
          },
          {
            name: t('usage.operator.label'),
            type: 'text',
            wikidataprop: 'P137',
            placeholder: t('usage.operator.placeholder'),
            infobox: t('usage.operator.infobox'),
          },
          {
            name: t('usage.maintainedBy.label'),
            type: 'text',
            wikidataprop: 'P126',
            placeholder: t('usage.maintainedBy.placeholder'),
            infobox: t('usage.maintainedBy.infobox'),
          },
          {
            name: t('usage.owner.label'),
            type: 'text',
            wikidataprop: 'P127',
            placeholder: t('usage.owner.placeholder'),
            infobox: t('usage.owner.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('classification.title'),
    description: t('classification.description'),
    subcategories: [
      {
        name: t('classification.title'),
        description: t('classification.description'),
        properties: [
          {
            name: t('classification.instanceOf.label'),
            value: [t('classification.instanceOf.value')],
            type: 'text',
            wikidataprop: 'P31',
            placeholder: t('classification.instanceOf.placeholder'),
            infobox: t('classification.instanceOf.infobox'),
          },
          {
            name: t('classification.commonsCategory.label'),
            type: 'text',
            wikidataprop: 'P373',
            placeholder: t('classification.commonsCategory.placeholder'),
            infobox: t('classification.commonsCategory.infobox'),
          },
          {
            name: t('classification.protectionCategory.label'),
            type: 'text',
            wikidataprop: 'P1435',
            placeholder: t('classification.protectionCategory.placeholder'),
            infobox: t('classification.protectionCategory.infobox'),
          },
          {
            name: t('classification.monumentList.label'),
            type: 'text',
            wikidataprop: 'P2817',
            placeholder: t('classification.monumentList.placeholder'),
            infobox: t('classification.monumentList.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('links.title'),
    description: t('links.description'),
    subcategories: [
      {
        name: t('links.title'),
        description: t('links.description'),
        properties: [
          {
            name: t('links.website.label'),
            type: 'url',
            wikidataprop: 'P856',
            placeholder: t('links.website.placeholder'),
            infobox: t('links.website.infobox'),
          },
        ],
      },
    ],
  },
  {
    title: t('media.title'),
    description: t('media.description'),
    subcategories: [
      {
        name: t('media.title'),
        description: t('media.description'),
        properties: [
          {
            name: t('media.image.label'),
            type: 'file',
            wikidataprop: 'P18',
            placeholder: t('media.image.placeholder'),
            infobox: t('media.image.infobox'),
          },
          {
            name: t('media.backImage.label'),
            type: 'file',
            wikidataprop: 'P7417',
            placeholder: t('media.backImage.placeholder'),
            infobox: t('media.backImage.infobox'),
          },
          {
            name: t('media.entranceImage.label'),
            type: 'file',
            wikidataprop: 'P9721',
            placeholder: t('media.entranceImage.placeholder'),
            infobox: t('media.entranceImage.infobox'),
          },
          {
            name: t('media.aerialView.label'),
            type: 'file',
            wikidataprop: 'P8592',
            placeholder: t('media.aerialView.placeholder'),
            infobox: t('media.aerialView.infobox'),
          },
          {
            name: t('media.interiorView.label'),
            type: 'file',
            wikidataprop: 'P5775',
            placeholder: t('media.interiorView.placeholder'),
            infobox: t('media.interiorView.infobox'),
          },
          {
            name: t('media.floorPlan.label'),
            type: 'file',
            wikidataprop: 'P3311',
            placeholder: t('media.floorPlan.placeholder'),
            infobox: t('media.floorPlan.infobox'),
          },
        ],
      },
    ],
  },
];
