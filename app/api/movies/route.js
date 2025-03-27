import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Retrieve a list of movies
 *     description: Returns 10 movies from the db
 *     responses:
 *       200:
 *         description: Movies fetched
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    // Connexion à la base de données MongoDB
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    // Récupération des 10 premiers films de la collection "movies"
    const movies = await db.collection('movies').find({}).limit(10).toArray();

    // Retourne la liste des films avec un statut 200 (succès)
    return NextResponse.json({ status: 200, data: movies });
  } catch (error) {
    // Gestion des erreurs serveur et renvoi d'un message d'erreur
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags:
 *       - Movies
 *     description: Add a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               plot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Movie added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 605c72ef153207001f1c76e0
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');

    // Extraction du corps de la requête JSON
    const body = await request.json();

    // Vérification que les champs requis sont bien fournis
    if (!body.title || !body.plot) {
      return NextResponse.json({ status: 400, message: 'Missing required fields', error: 'title and plot are required' }, { status: 400 });
    }

    // Création d'un objet film avec les données reçues
    const newMovie = { title: body.title, plot: body.plot };

    // Insertion du nouveau film dans la collection "movies"
    const result = await db.collection('movies').insertOne(newMovie);

    // Retourne un message de succès avec l'ID du film inséré
    return NextResponse.json({ status: 201, message: 'Movie added successfully', data: { id: result.insertedId } }, { status: 201 });
  } catch (error) {
    // Gestion des erreurs serveur et renvoi d'un message d'erreur
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
