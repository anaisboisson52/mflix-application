import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     tags:
 *       - Theaters
 *     summary: Retrieve a theater by ID
 *     description: Returns a single theater from the db by its ID
 *     parameters:
 *       - name: idTheater
 *         in: path
 *         required: true
 *         description: ID of the theater to retrieve
 *         schema:
 *           type: string
 *           example: 605c72ef153207001f1c76e0
 *     responses:
 *       200:
 *         description: Theater found
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
 *                     theater:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                           example: "New York"
 *                         state:
 *                           type: string
 *                           example: "NY"
 *       400:
 *         description: Invalid theater ID
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request, { params }) {
    try {
      //Connexion à la bdd
      const client = await clientPromise;
      const db = client.db('sample_mflix');
      
      const { idTheater } = params;
      // Vérification de l'ID 
      if (!ObjectId.isValid(idTheater)) {
        return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
      }
      
       // Recherche du théâtre par ID
      const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater)});
      
      // Vérification si le théâtre existe
      if (!theater) {
        // Retourne les données du théâtre si trouvé
        return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
      }
      
      return NextResponse.json({ status: 200, data: { theater } });
    } catch (error) {
      //Gestion d'erreurs
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   put:
 *     tags:
 *       - Theaters
 *     summary: Update a theater by ID
 *     description: Updates the city and/or state of a theater by its ID
 *     parameters:
 *       - name: idTheater
 *         in: path
 *         required: true
 *         description: ID of the theater to update
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
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Theater updated successfully
 *       400:
 *         description: Invalid theater ID or missing fields
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idTheater } = params;
    const body = await request.json();

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID' }, { status: 400 });
    }

    // Vérification qu'au moins un champ est fourni
    if (!body.city && !body.state) {
      return NextResponse.json({ status: 400, message: 'At least one field (city or state) is required' }, { status: 400 });
    }

    // Construction des champs à mettre à jour
    const updateFields = {};
    if (body.city) updateFields.city = body.city;
    if (body.state) updateFields.state = body.state;

    // Mise à jour du théâtre
    const result = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: updateFields }
    );

    // Vérification si l'ID existe bien dans la BDD
    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: 'Theater updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error).message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   delete:
 *     tags:
 *       - Theaters
 *     summary: Delete a theater by ID
 *     description: Deletes a theater from the database by its ID
 *     parameters:
 *       - name: idTheater
 *         in: path
 *         required: true
 *         description: ID of the theater to delete
 *         schema:
 *           type: string
 *           example: 605c72ef153207001f1c76e0
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *       400:
 *         description: Invalid theater ID
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idTheater } = params;

    // Vérification de l'ID
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID' }, { status: 400 });
    }

     // Suppression du théâtre
    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    // Vérification si le théâtre a bien été supprimé
    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: 'Theater deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error ).message }, { status: 500 });
  }
}
