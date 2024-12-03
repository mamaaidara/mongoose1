require('dotenv').config();
const mongoose = require('mongoose');

// Configuration et connexion à MongoDB
const mongoURI = process.env.MONGO_URI;

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connexion à MongoDB réussie 🚀');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1); // Arrête l'exécution du script en cas d'erreur de connexion
  }
}

// Définition du schéma et du modèle
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

// Fonction principale
async function main() {
  try {
    // 1. Créer une nouvelle instance de Person et la sauvegarder
    const chalma = new Person({
      name: 'Chalma',
      age: 22,
      favoriteFoods: ['tajine', 'couscous'],
    });
    const savedPerson = await chalma.save();
    console.log('Personne enregistrée :', savedPerson);

    // 2. Ajouter plusieurs personnes
    const arrayOfPeople = [
      { name: 'Aissa', age: 30, favoriteFoods: ['pizza', 'pasta'] },
      { name: 'Abdoulaye', age: 25, favoriteFoods: ['burritos', 'tacos'] },
      { name: 'Awa', age: 35, favoriteFoods: ['sushi', 'ramen'] },
    ];
    const people = await Person.create(arrayOfPeople);
    console.log('Personnes créées :', people);

    // 3. Rechercher des personnes avec `find()`
    const peopleFound = await Person.find({ name: 'Aissa' });
    console.log('Personnes trouvées :', peopleFound);

    // 4. Rechercher une personne avec `findOne()`
    const personFound = await Person.findOne({ favoriteFoods: 'pizza' });
    console.log('Personne trouvée :', personFound);

    // 5. Rechercher une personne par ID avec `findById()`
    const personById = await Person.findById(peopleFound[0]._id);
    console.log('Personne trouvée par ID :', personById);

    // 6. Mettre à jour une personne
    personById.favoriteFoods.push('ramen');
    const updatedPerson = await personById.save();
    console.log('Personne mise à jour :', updatedPerson);

    // 7. Mise à jour avec `findOneAndUpdate()`
    const updatedPersonByName = await Person.findOneAndUpdate(
      { name: 'Abdoulaye' },
      { age: 28 },
      { new: true }
    );
    console.log('Personne mise à jour avec findOneAndUpdate() :', updatedPersonByName);

    // 8. Suppression avec `findByIdAndDelete()`
    const personDeleted = await Person.findByIdAndDelete(updatedPersonByName._id);
    console.log('Personne supprimée :', personDeleted);

    // 9. Suppression multiple avec `deleteMany()`
    const result = await Person.deleteMany({ name: 'Awa' });
    console.log(`${result.deletedCount} personne(s) supprimée(s)`);

    // 10. Recherche avancée avec tri, limite et projection
    const burritoLovers = await Person.find({ favoriteFoods: 'burritos' })
      .sort({ name: 1 })
      .limit(2)
      .select('-age'); // Cache l'âge
    console.log('Personnes trouvées qui aiment les burritos :', burritoLovers);
  } catch (err) {
    console.error('Erreur :', err);
  } finally {
    mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
  }
}

// Connexion à MongoDB et exécution de la fonction principale
connectToMongoDB().then(main);
