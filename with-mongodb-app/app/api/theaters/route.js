import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     tags:
 *       - Theaters
 *     summary: Retrieve a list of theaters
 *     description: Returns 10 theaters from the db
 *     responses:
 *       200:
 *         description: Theaters fetched
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    const theaters = await db.collection('theaters').find({}).limit(10).toArray();

    return NextResponse.json({ status: 200, data: theaters });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     tags:
 *       - Theaters
 *     description: Add a new theater to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - state
 *             properties:
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Theater added successfully
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
 *                   example: Theater added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 605c72ef153207001f1c76e0
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');

    const body = await request.json();

    if (!body.city || !body.state) {
      return NextResponse.json({ status: 400, message: 'Missing required fields', error: 'city and state are required' }, { status: 400 });
    }

    const newTheater = { city: body.city, state: body.state };

    const result = await db.collection('theaters').insertOne(newTheater);

    return NextResponse.json({ status: 201, message: 'Theater added successfully', data: { id: result.insertedId } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
