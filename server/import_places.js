import { getPool } from './src/mysql.js';

const placesData = {
  "Thiruvananthapuram": [
    "Sree Padmanabhaswamy Temple", "Kovalam Beach", "Varkala Cliff & Beach", 
    "Ponmudi", "Napier Museum", "Kuthiramalika Palace", "Shangumugham Beach", 
    "Poovar Island", "Neyyar Dam", "Agasthyakoodam"
  ],
  "Kollam": [
    "Ashtamudi Lake", "Jatayu Earth Center", "Palaruvi Waterfalls", 
    "Thangassery Lighthouse", "Kollam Beach", "Thenmala Ecotourism", 
    "Sasthamkotta Lake", "Mayyanad Beach", "Oachira Temple", "Munroe Island"
  ],
  "Pathanamthitta": [
    "Sabarimala Temple", "Gavi", "Aranmula Temple", "Perunthenaruvi Waterfalls", 
    "Konni Elephant Camp", "Parumala Church", "Achankovil", "Kakki Reservoir", 
    "Pandalam Palace", "Malayalapuzha Temple"
  ],
  "Alappuzha": [
    "Alappuzha Backwaters", "Alappuzha Beach", "Marari Beach", "Kuttanad", 
    "Pathiramanal Island", "Krishnapuram Palace", "Ambalappuzha Temple", 
    "Kumarakom Bird Sanctuary (border area)", "Arthunkal Church", "Mannarasala Temple"
  ],
  "Kottayam": [
    "Kumarakom", "Illikkal Kallu", "Vagamon", "Marmala Waterfalls", "Vaikom Temple", 
    "Ettumanoor Temple", "Poonjar Palace", "Thangalpara", "Nadukani", "Aruvikkuzhi Waterfalls"
  ],
  "Idukki": [
    "Munnar", "Thekkady", "Periyar Wildlife Sanctuary", "Idukki Dam", "Ramakkalmedu", 
    "Kolukkumalai", "Anamudi Peak", "Mattupetty Dam", "Eravikulam National Park", "Vagamon (border area)"
  ],
  "Ernakulam": [
    "Fort Kochi", "Mattancherry Palace", "Marine Drive", "Lulu Mall", "Cherai Beach", 
    "Hill Palace Museum", "Wonderla", "Bolgatty Palace", "Thattekad Bird Sanctuary", "Jewish Synagogue"
  ],
  "Thrissur": [
    "Guruvayur Temple", "Athirappilly Waterfalls", "Vadakkunnathan Temple", "Thrissur Zoo", 
    "Chavakkad Beach", "Kodungallur Temple", "Snehatheeram Beach", "Peechi Dam", 
    "Kerala Kalamandalam", "Vazhachal Waterfalls"
  ],
  "Palakkad": [
    "Palakkad Fort", "Silent Valley", "Malampuzha Dam", "Parambikulam Tiger Reserve", 
    "Nelliyampathy", "Dhoni Waterfalls", "Attappady", "Kava Island", "Meenvallam Waterfalls", "Kalpathy Temple"
  ],
  "Malappuram": [
    "Kottakkunnu", "Nilambur Teak Museum", "Adyanpara Waterfalls", "Biyyam Kayal", 
    "Kodikuthimala", "Kadalundi Bird Sanctuary", "Tanur Beach", "Thirunavaya Temple", "Arimbra Hills", "Mini Ooty"
  ],
  "Kozhikode": [
    "Kozhikode Beach", "Kappad Beach", "Beypore Port", "Thusharagiri Waterfalls", 
    "Mananchira Square", "Sarovaram Park", "Planetarium", "Vellari Mala", "Peruvannamuzhi Dam", "SM Street"
  ],
  "Wayanad": [
    "Edakkal Caves", "Banasura Sagar Dam", "Chembra Peak", "Soochipara Waterfalls", 
    "Pookode Lake", "Wayanad Wildlife Sanctuary", "Kuruvadweep", "Thirunelli Temple", 
    "Meenmutty Waterfalls", "Lakkidi View Point"
  ],
  "Kannur": [
    "Muzhappilangad Drive-in Beach", "St. Angelo Fort", "Payyambalam Beach", 
    "Aralam Wildlife Sanctuary", "Parassinikadavu Temple", "Palakkayam Thattu", 
    "Meenkunnu Beach", "Madayi Para", "Dharmadam Island", "Theyyam (cultural attraction)"
  ],
  "Kasaragod": [
    "Bekal Fort", "Ranipuram", "Ananthapura Lake Temple", "Kappil Beach", 
    "Chandragiri Fort", "Valiyaparamba Backwaters", "Mallikarjuna Temple", 
    "Bekal Beach", "Posadi Gumpe", "Nileshwaram"
  ]
};

async function seed() {
  const pool = await getPool();
  try {
    await pool.query('TRUNCATE TABLE places');
    for (const district in placesData) {
      const places = placesData[district];
      for (const place of places) {
        // Just setting standard price to 200 for now. The instruction didn't specify prices.
        const q = 'INSERT INTO places (name, district, price_per_person) VALUES (?, ?, ?)';
        await pool.query(q, [place, district, 200]);
        console.log(`Inserted ${place} into ${district}`);
      }
    }
    console.log("Done seeding places.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
