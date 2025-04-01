require('dotenv').config(); // Charger les variables d'environnement

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // Utiliser SignJWT pour signer les tokens
import clientPromise from '@/lib/mongodb'; // Assurez-vous que ce fichier est bien configuré
import { ObjectId } from 'mongodb';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentification
 *     description: Authentifie un utilisateur. Si l'utilisateur n'existe pas, un compte est créé avec un mot de passe haché.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Authentification réussie. Retourne un JWT et un refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentifié"
 *                 jwt:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Champs requis manquants (email et mot de passe).
 *       401:
 *         description: Mot de passe incorrect.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db('sample_mflix'); // Accéder à la base de données
    const users = db.collection('users'); // Définir la collection "users"

    // Vérification si l'utilisateur existe déjà
    let user = await users.findOne({ email });
    if (!user) {
        return NextResponse.json({ error: "L'utilisateur n'existe pas" }, { status: 404 });
    }

    // Comparer le mot de passe envoyé avec celui stocké dans la base de données (haché)
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // Générer un JWT et un refresh token avec SignJWT de jose
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(SECRET_KEY));

    const refreshToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(REFRESH_SECRET));

    // Stocker les tokens dans des cookies (httpOnly pour la sécurité)
    const response = NextResponse.json({ message: "Authentifié", jwt: token });
    response.cookies.set('token', token, { httpOnly: true, secure: true, path: '/' });
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: true, path: '/' });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Une erreur s'est produite" }, { status: 500 });
  }
}
