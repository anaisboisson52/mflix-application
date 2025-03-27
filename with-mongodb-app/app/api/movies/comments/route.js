import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Retrieve a list of comments
 *     description: Returns 10 comments from the db
 *     responses:
 *       200:
 *         description: Comments fetched
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    // Connexion à la base de données MongoDB
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    // Récupération des 10 premiers commentaires de la collection "comments"
    const comments = await db.collection('comments').find({}).limit(10).toArray();
    
    // Retourne la liste des commentaires avec un statut 200 (succès)
    return NextResponse.json(
      { status: 200, data: comments }
    );
  }
  catch (error) {
    // Gestion des erreurs serveur et renvoi d'un message d'erreur
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error', error: error.message }
    );
  }
}

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add a new comment
 *     description: Adds a new comment to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Comment added successfully
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
 *                   example: "Comment added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "605c72ef153207001f1c76e0"
 *       400:
 *         description: Missing required fields (name and email)
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
    if (!body.name || !body.email) {
      return NextResponse.json(
        { status: 400, message: 'Missing required fields', error: 'name and email are required' },
        { status: 400 }
      );
    }

    // Création d'un objet commentaire avec les données reçues
    const newComment = {
      name: body.name,
      email: body.email
    };

    // Insertion du nouveau commentaire dans la collection "comments"
    const result = await db.collection('comments').insertOne(newComment);

    // Retourne un message de succès avec l'ID du commentaire inséré
    return NextResponse.json(
      { status: 201, message: 'Comment added successfully', data: { id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    // Gestion des erreurs serveur et renvoi d'un message d'erreur
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error', error: (error).message },
      { status: 500 }
    );
  }
}
