import fs from 'fs';
let schema = fs.readFileSync('server/schema.sql', 'utf8');

schema = schema.replace(/INSERT INTO places \(, , , \) VALUES/, "INSERT INTO places (`name`, `district`, `description`, `price_per_person`) VALUES");
schema = schema.replace(/INSERT INTO places \(\) VALUES/, "INSERT INTO places (`name`, `district`, `description`, `price_per_person`) VALUES");

fs.writeFileSync('server/schema.sql', schema);
