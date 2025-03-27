import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Retrieve a movie by ID
 *     description: Returns a single movie from the db by its ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         description: ID of the movie to retrieve
 *         schema:
 *           type: string
 *           example: 605c72ef153207001f1c76e0
 *     responses:
 *       200:
 *         description: Movie found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     movie:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: "The Matrix"
 *                         plot:
 *                           type: string
 *                           example: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request, { params }) {
  try {
    // Connexion à la base de données
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    // On vérifie que l'ID est valide
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    // Recherche du film dans la collection
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
  
    //On vérifie que le film existe
    if (!movie) {
      //Si il existe, on retourne le film
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error) {
    //Sinon, gestion des erreurs serveur
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     tags:
 *       - Movies
 *     summary: Update a movie by ID
 *     description: Updates the title and/or plot of a movie by its ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         description: ID of the movie to update
 *         schema:
 *           type: string
 *           example: 605c72ef153207001f1c76e0
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
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid movie ID or missing fields
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idMovie } = params;
    const body = await request.json();

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' }, { status: 400 });
    }

     //On vérifie qu'au moins un des champs a mettre a jour est fourni
    if (!body.title && !body.plot) {
      return NextResponse.json({ status: 400, message: 'At least one field (title or plot) is required' }, { status: 400 });
    }

     // Préparation des champs à mettre à jour
    const updateFields = {};
    if (body.title) updateFields.title = body.title;
    if (body.plot) updateFields.plot = body.plot;

    // Mise à jour du film dans la base de données
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: updateFields }
    );

    // Vérification si le film existe
    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found' }, { status: 404 });
    }

    //S'il existe, on retourne un message de succès
    return NextResponse.json({ status: 200, message: 'Movie updated successfully' }, { status: 200 });

  } catch (error) {
    //Sinon on a la gestion d'erreur du serveur
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error).message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: Delete a movie by ID
 *     description: Deletes a movie from the database by its ID
 *     parameters:
 *       - name: idMovie
 *         in: path
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: string
 *           example: 605c72ef153207001f1c76e0
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' }, { status: 400 });
    }

    //On supprime le film de la base de données
    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    //On vérifie si le film existe
    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: 'Movie deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error ).message }, { status: 500 });
  }
}
