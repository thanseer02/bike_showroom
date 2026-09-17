export interface MotorcycleSpec {
  label: string;
  value: string;
}

export interface MotorcycleColor {
  name: string;
  hex: string;
}

export interface MotorcycleData {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  colors: MotorcycleColor[];
  imageUrl?: string;
  specs: {
    engine: string;
    displacement: string;
    power: string;
    torque: string;
    transmission: string;
    weight: string;
    fuelCapacity: string;
    mileage: string;
    seatHeight: string;
  };
}

export const motorcycles: MotorcycleData[] = [
  {
    id: 'mt-15',
    name: 'Yamaha MT-15',
    category: 'Hyper Naked',
    tagline: 'The Dark Side of Japan',
    description: 'Agile, aggressive, and built for the urban jungle. The MT-15 brings Hyper Naked attitude to the streets with its torque-rich 155cc engine and distinctive predator-style dual eye face.',
    specs: {
      engine: 'Liquid-cooled, 4-stroke, SOHC, 4-valve',
      displacement: '155 cc',
      power: '18.4 PS @ 10000 rpm',
      torque: '14.1 Nm @ 7500 rpm',
      transmission: '6-Speed Constant Mesh',
      weight: '141 kg (Kerb)',
      fuelCapacity: '10 Liters',
      mileage: '45 kmpl (Approx)',
      seatHeight: '810 mm'
    },
    colors: [
      { name: 'Racing Blue', hex: '#0025a8' },
      { name: 'Cyan Storm', hex: '#00bcd4' },
      { name: 'Metallic Black', hex: '#111111' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'meteor-350',
    name: 'Royal Enfield Meteor 350',
    category: 'Cruiser',
    tagline: 'Cruise Easy',
    description: "The Meteor represents the eternal essence of riding. It's a cruiser designed for long rides with its refined 349cc engine, relaxed riding posture, and classic styling.",
    specs: {
      engine: 'Air-Oil cooled, 4-stroke, SOHC',
      displacement: '349 cc',
      power: '20.2 bhp @ 6100 rpm',
      torque: '27 Nm @ 4000 rpm',
      transmission: '5-Speed Constant Mesh',
      weight: '191 kg (Kerb)',
      fuelCapacity: '15 Liters',
      mileage: '35 kmpl (Approx)',
      seatHeight: '765 mm'
    },
    colors: [
      { name: 'Fireball Yellow', hex: '#facc15' },
      { name: 'Stellar Red', hex: '#991b1b' },
      { name: 'Supernova Blue', hex: '#1e3a8a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop'
  }
];
