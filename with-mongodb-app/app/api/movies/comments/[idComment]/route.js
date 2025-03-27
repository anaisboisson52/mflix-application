import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Retrieve a single comment by ID
 *     description: Returns the comment details for the specified comment ID
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment fetched successfully
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
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     comment:
 *                       type: string
 *                       example: "Great movie, really enjoyed it!"
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid Comment ID', error: 'ID format is incorrect' });
    }
    
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
    
    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update an existing comment by ID
 *     description: Updates the details of a specific comment based on the provided comment ID
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid comment ID or missing fields
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idComment } = params;
    const body = await request.json();

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID' }, { status: 400 });
    }

    if (!body.name && !body.email) {
      return NextResponse.json({ status: 400, message: 'At least one field (name or email) is required' }, { status: 400 });
    }

    const updateFields = {};
    if (body.name) updateFields.name = body.name;
    if (body.email) updateFields.email = body.email;

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: 'Comment updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error).message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment by ID
 *     description: Deletes a specific comment based on the provided comment ID
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const { idComment } = params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID' }, { status: 400 });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: (error).message }, { status: 500 });
  }
}
