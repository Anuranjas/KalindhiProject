export const packages = [
  {
    id: 'backwaters',
    name: 'Backwaters Escape',
    price: 14999,
    duration: '3 Days / 2 Nights',
    highlight: true,
    districts: ['Alappuzha', 'Kottayam'],
    features: [
      'Alleppey houseboat stay',
      'Sunset cruise & canoe ride',
      'Traditional Kerala meals',
      'Airport transfers',
    ],
    cta: '/signup',
  },
  {
    id: 'hills',
    name: 'Hill Station Retreat',
    price: 21999,
    duration: '4 Days / 3 Nights',
    districts: ['Idukki'],
    features: [
      'Munnar tea plantation tour',
      'Eravikulam National Park visit',
      'Campfire & local dinner',
      '3-star resort stay',
    ],
    cta: '/signup',
  },
  {
    id: 'beach-culture',
    name: 'Beach & Culture',
    price: 18999,
    duration: '4 Days / 3 Nights',
    districts: ['Thiruvananthapuram'],
    features: [
      'Kovalam beach day trip',
      'Kathakali cultural evening',
      'Ayurvedic spa session',
      'City tour of Trivandrum',
    ],
    cta: '/signup',
  },
  {
    id: 'grand-kerala',
    name: 'Grand Kerala Circuit',
    price: 34999,
    duration: '6 Days / 5 Nights',
    districts: ['Ernakulam', 'Idukki', 'Alappuzha'],
    features: [
      'Cochin • Munnar • Thekkady • Alleppey',
      'Jeep safari & spice plantation',
      'Deluxe houseboat + resort stays',
      'Breakfast & transfers included',
    ],
    cta: '/signup',
  },
  {
    id: 'wayanad-wild',
    name: 'Wayanad Wildlife & Caves',
    price: 23999,
    duration: '4 Days / 3 Nights',
    districts: ['Wayanad'],
    features: [
      'Edakkal caves exploration',
      'Wayanad wildlife safari',
      'Banasura Sagar dam visit',
      'Comfort resort stay',
    ],
    cta: '/signup',
  },
  {
    id: 'ayurveda-wellness',
    name: 'Ayurveda Wellness Retreat',
    price: 27999,
    duration: '5 Days / 4 Nights',
    districts: ['Thiruvananthapuram'],
    features: [
      'Daily authentic Ayurvedic therapies',
      'Doctor consultation & diet plan',
      'Yoga & meditation sessions',
      'Beachside calm resort',
    ],
    cta: '/signup',
  },
  {
    id: 'north-kerala',
    name: 'North Kerala Explorer',
    price: 25999,
    duration: '5 Days / 4 Nights',
    districts: ['Kasaragod', 'Kannur'],
    features: [
      'Bekal Fort & beach sunset',
      'Kannur Theyyam experience (seasonal)',
      'Muzhappilangad drive-in beach',
      'Local seafood tasting',
    ],
    cta: '/signup',
  },
  {
    id: 'kochi-heritage',
    name: 'Kochi Heritage Weekend',
    price: 12999,
    duration: '2 Days / 1 Night',
    districts: ['Ernakulam'],
    features: [
      'Fort Kochi walking tour',
      'Chinese fishing nets & sunset',
      'Synagogue & Dutch Palace visit',
      'Boutique homestay',
    ],
    cta: '/signup',
  },
];

export const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const allDistricts = Array.from(
  new Set(packages.flatMap((p) => p.districts || []))
).sort();
