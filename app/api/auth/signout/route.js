import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     tags:
 *       - Authentification
 *     description: Logout the user and delete the authentication tokens
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req) {
  try {
    // Création de la réponse
    const response = NextResponse.json({ message: 'User logged out successfully' });

    // Supprimer les cookies de session
    response.cookies.delete('token', { path: '/' });
    response.cookies.delete('refreshToken', { path: '/' });

    return response;
  } catch (error) {
    // En cas d'erreur
    return NextResponse.json({ error: "Une erreur s'est produite lors de la déconnexion" }, { status: 500 });
  }
}
