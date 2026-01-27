import bcrypt from 'bcryptjs';
const hash = '$2a$10$qwsf0noCFoIT5hs./xudhefFnr0FrWNx1oqwHxceXD.3T6kmNXBQq';
const password = 'Admin@123';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
}).catch(err => {
    console.error(err);
});
