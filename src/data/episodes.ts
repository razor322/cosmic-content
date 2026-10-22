export type SceneId = 'hook' | 'core' | 'add1' | 'add2' | 'closer';

export type SceneCopy = {
  narration: string;
  keyPoint?: string;
  onScreen?: string[];
  highlight?: string;
};

export type PlanetVariant = 'banded' | 'ringed' | 'cloudy' | 'cratered' | 'star';

export type Lead = 'indigo' | 'purple' | 'magenta';

export type Episode = {
  id: string;
  number: number;
  voice: string;
  seed: number;
  planetVariant: PlanetVariant;
  lead: Lead;
  context: string;
  scenes: {
    hook: SceneCopy;
    core: SceneCopy;
    add1: SceneCopy;
    add2: SceneCopy;
    closer?: SceneCopy;
  };
};

export const SIGN_OFF = 'Beyond the sky, the story is only beginning.';

export const DEFAULT_VOICE = 'en-US-AndrewNeural';

export const episodes: Episode[] = [
  {
    id: 'ep01',
    number: 1,
    voice: DEFAULT_VOICE,
    seed: 101,
    planetVariant: 'banded',
    lead: 'indigo',
    context: 'WHERE THE ATOMS IN YOUR BODY COME FROM',
    scenes: {
      hook: {
        narration: 'You are made of stars.',
        onScreen: ['YOU ARE', 'MADE OF', 'STARS.'],
        highlight: 'STARS.',
      },
      core: {
        narration:
          'The calcium in your bones and the iron in your blood were forged inside stars that died before our Sun was born.',
        keyPoint: 'ATOMS FORGED IN STARS',
      },
      add1: {
        narration:
          'But it gets bigger. Our galaxy holds hundreds of billions of stars, and each one is a sun.',
        keyPoint: 'HUNDREDS OF BILLIONS',
      },
      add2: {
        narration:
          'The light from the Andromeda galaxy began its journey 2.5 million years ago, before our species even existed.',
        keyPoint: '2.5 MILLION YEARS',
      },
    },
  },
  {
    id: 'ep02',
    number: 2,
    voice: DEFAULT_VOICE,
    seed: 102,
    planetVariant: 'cloudy',
    lead: 'magenta',
    context: 'THE STRANGEST DAY IN THE SOLAR SYSTEM',
    scenes: {
      hook: {
        narration: 'A Venus day outlasts its year.',
        onScreen: ['A DAY ON', 'VENUS', 'OUTLASTS', 'ITS YEAR.'],
        highlight: 'OUTLASTS',
      },
      core: {
        narration:
          'Venus turns so slowly that one full rotation takes 243 Earth days, while one trip around the Sun takes only 225.',
        keyPoint: '243 DAYS VS 225 DAYS',
      },
      add1: {
        narration: 'But it gets stranger. Venus spins backwards, so the Sun rises in the west.',
        keyPoint: 'SUN RISES IN THE WEST',
      },
      add2: {
        narration:
          'And its thick clouds trap so much heat that the surface is hot enough to melt lead.',
        keyPoint: 'HOT ENOUGH TO MELT LEAD',
      },
    },
  },
  {
    id: 'ep03',
    number: 3,
    voice: DEFAULT_VOICE,
    seed: 103,
    planetVariant: 'star',
    lead: 'purple',
    context: 'THE DENSEST THING YOU CAN SEE IN SPACE',
    scenes: {
      hook: {
        narration: 'One teaspoon. Billions of tons.',
        onScreen: ['ONE TEASPOON.', 'BILLIONS', 'OF TONS.'],
        highlight: 'BILLIONS',
      },
      core: {
        narration:
          'A neutron star packs more mass than our entire Sun into a ball only about the size of a city.',
        keyPoint: 'A SUN SQUEEZED INTO A CITY',
      },
      add1: {
        narration: 'But it gets wilder. Some neutron stars spin hundreds of times every second.',
        keyPoint: 'HUNDREDS OF SPINS PER SECOND',
      },
      add2: {
        narration:
          'Their flashes sweep across space like cosmic lighthouses, so regular that astronomers use them as clocks.',
        keyPoint: 'COSMIC LIGHTHOUSES',
      },
    },
  },
  {
    id: 'ep04',
    number: 4,
    voice: DEFAULT_VOICE,
    seed: 104,
    planetVariant: 'star',
    lead: 'magenta',
    context: 'WHAT SUNLIGHT REALLY IS',
    scenes: {
      hook: {
        narration: 'Sunlight is ancient energy.',
        onScreen: ['SUNLIGHT IS', 'ANCIENT', 'ENERGY.'],
        highlight: 'ANCIENT',
      },
      core: {
        narration:
          "Sunlight takes eight minutes to reach Earth, but its energy spent many thousands of years bouncing out of the Sun's core.",
        keyPoint: '8 MINUTES + THOUSANDS OF YEARS',
      },
      add1: {
        narration: 'But it gets older. The hydrogen fuel inside the Sun dates back to the Big Bang.',
        keyPoint: 'FUEL FROM THE BIG BANG',
      },
      add2: {
        narration:
          'And every plant on Earth turns that ancient energy into the food and oxygen we live on.',
        keyPoint: 'PLANTS RUN ON ANCIENT ENERGY',
      },
    },
  },
  {
    id: 'ep05',
    number: 5,
    voice: DEFAULT_VOICE,
    seed: 105,
    planetVariant: 'ringed',
    lead: 'indigo',
    context: 'HOW BIG THE UNIVERSE REALLY IS',
    scenes: {
      hook: {
        narration: 'More stars than grains of sand.',
        onScreen: ['MORE STARS', 'THAN GRAINS', 'OF SAND.'],
        highlight: 'STARS',
      },
      core: {
        narration:
          'All the beaches and deserts on Earth together hold fewer grains of sand than the observable universe holds stars.',
        keyPoint: 'STARS OUTNUMBER SAND',
      },
      add1: {
        narration:
          'But it gets bigger. Our galaxy is just one of hundreds of billions, maybe even trillions.',
        keyPoint: 'TRILLIONS OF GALAXIES',
      },
      add2: {
        narration:
          'And everything we can see makes up only about five percent of what the universe is made of.',
        keyPoint: 'ONLY 5% IS VISIBLE',
      },
    },
  },
  {
    id: 'ep06',
    number: 6,
    voice: DEFAULT_VOICE,
    seed: 106,
    planetVariant: 'cratered',
    lead: 'purple',
    context: 'WHY THE MOON KEEPS OUR FOOTPRINTS',
    scenes: {
      hook: {
        narration: 'Footprints that last millions of years.',
        onScreen: ['FOOTPRINTS', 'THAT LAST', 'MILLIONS', 'OF YEARS.'],
        highlight: 'MILLIONS',
      },
      core: {
        narration:
          'The Moon has no wind and no rain, so the footprints astronauts left in 1969 are still there today.',
        keyPoint: 'NO WIND, NO RAIN',
      },
      add1: {
        narration:
          'Only tiny space dust slowly wears them away, so they may last for millions of years.',
        keyPoint: 'ONLY SPACE DUST ERODES',
      },
      add2: {
        narration: 'And every year, the Moon drifts about four centimeters farther away from Earth.',
        keyPoint: '4 CM FARTHER EACH YEAR',
      },
    },
  },
];

export const episodeById = (id: string): Episode | undefined =>
  episodes.find((episode) => episode.id === id);
