// /*============ IMPORT USED MODULES ============*/
const { faker } = require('@faker-js/faker');

const User = require('./../_models/IUser');


// /*============ GENERATE FIXTURES ============*/
const generateFakeUserData = () => {
    return {
        email: faker.internet.email(),
        nickname: faker.internet.userName(),
        password: faker.internet.password(),
        registeredAt: faker.date.past()
    };
};

const createFakeUser = async () => {
    const fakeUserData = generateFakeUserData();

    try {
        const newUser = new User(fakeUserData);
        await newUser.save();
        console.log('Utilisateur ajouté à la base de données:', newUser);
    }
    catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur à la base de données:', error);
    }
};

// Générer un utilisateur fictif et l'ajouter à la base de données
createFakeUser();

