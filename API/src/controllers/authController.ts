import {PrismaClient as PostgresClient} from '../../prisma/client/postgresClient'
import {RequestHandler, Request, Response, NextFunction} from "express"
import {config} from '../config/env'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import type {CurrentUser} from '../types'
import nodemailer from 'nodemailer'
import {
    accessTokenExpiration,
    refreshTokenExpiration,
    refreshTokenName,
    accessTokenName,
    UserRole,
    userRole
} from '../config/utils'
import crypto from 'crypto'
import MapBoxController from "./mapBoxController"

const postgresClient = new PostgresClient()

const transporter = nodemailer.createTransport({
    service: 'ionos',
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
})

class AuthController {
    login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body
        try {
            const user = await postgresClient.user.findUnique({where: {email}})
            if (!user) {
                res.status(404).json({error: 'User not found'})
                return
            }

            if (!user.otpVerified) {
                res.status(403).json({ accessToken: '', optVerified: false })
                return
            }

            if (await argon2.verify(user.password, password)) {
                const accessToken = jwt.sign(
                    {id: user.id, email: user.email, roles: user.roles as UserRole[]},
                    config.ACCESS_TOKEN_SECRET,
                    {expiresIn: accessTokenExpiration}
                )
                const refreshToken = jwt.sign(
                    {id: user.id, email: user.email, roles: user.roles as UserRole[]},
                    config.REFRESH_TOKEN_SECRET,
                    {expiresIn: refreshTokenExpiration}
                )

                await postgresClient.user.update({
                    where: {id: user.id},
                    data: {refreshToken}
                })

                res.cookie(refreshTokenName, refreshToken, {
                    httpOnly: true,
                    secure: config.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.cookie(accessTokenName, accessToken, {
                    httpOnly: true,
                    secure: config.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 10 * 60 * 1000 // 10 minutes
                })

                res.status(200).json({accessToken, optVerified: user.otpVerified})
            } else {
                res.status(401).json({error: 'Invalid email or password'})
            }

        } catch (error) {
            next(error)
        }
    }

    register: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            firstName,
            lastName,
            email,
            password,
            latitude,
            longitude,
            address,
            city,
            postalCode,
        } = req.body

        try {
            const hasGeolocation = typeof latitude === 'number' && typeof longitude === 'number'

            if (!hasGeolocation) {
                if (!address || !city || !postalCode) {
                    res.status(400).json({
                        error: 'Adresse, ville et code postal sont requis si la géolocalisation est absente.',
                    })
                    return
                }
            }

            const existingUser = await postgresClient.user.findUnique({where: {email}})
            if (existingUser) {
                res.status(409).json({error: 'User already exists'})
                return
            }

            const hashedPassword = await argon2.hash(password)

            const otp = crypto.randomInt(100000, 999999).toString()

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Votre code OTP pour vérification',
                text: `Bonjour ${firstName},\n\nVoici votre code de vérification OTP : ${otp}\n\nCe code est valide pendant 10 minutes.\n\nMerci.`,
            }

            await transporter.sendMail(mailOptions)

            await postgresClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    roles: [userRole.classic],
                    latitude,
                    longitude,
                    address,
                    city,
                    postalCode,
                    otpCode: otp,
                    otpCreatedAt: new Date(),
                    otpVerified: false,
                },
            })

            res.status(201).json({message: 'User registered successfully. OTP sent by email.'})
        } catch (error) {
            next(error)
            transporter.verify((error, success) => {
                if (error) {
                    console.error('Erreur de configuration mail:', error)
                } else {
                    console.log('Serveur mail prêt à envoyer')
                }
            })
        }
    }

    verifyOtp: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, otp } = req.body

        try {
            const user = await postgresClient.user.findUnique({
                where: { email },
            })

            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' })
                return
            }

            if (user.otpVerified) {
                res.status(400).json({ error: 'OTP déjà vérifié' })
                return
            }

            const now = new Date()
            if (!user.otpCreatedAt) {
                res.status(400).json({ error: 'OTP expiré' })
                return
            }
            const otpAgeMinutes = (now.getTime() - new Date(user.otpCreatedAt).getTime()) / 1000 / 60

            if (otpAgeMinutes > 10) {
                res.status(400).json({ error: 'OTP expiré' })
                return
            }

            if (user.otpCode !== otp) {
                res.status(400).json({ error: 'OTP invalide' })
                return
            }

            const controller = new MapBoxController()
            if (!user.address) {
                res.status(400).json({ error: "Adresse de l'utilisateur manquante" })
                return
            }
            const response = await controller.fetchNeighborhoodFromAddress(user.address)

            let neighborhood = await postgresClient.neighborhood.findFirst({
                where: { name: response.district },
            })

            if (!neighborhood) {
                neighborhood = await postgresClient.neighborhood.create({
                    data: {
                        name: response.district,
                        city: response.city,
                        postalCode: response.postalCode,
                        description: null,
                        members: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        image: null,
                    },
                })
            }else {
                await postgresClient.neighborhood.update({
                    where: { id: neighborhood.id },
                    data: {
                        members: { increment: 1 },
                        updatedAt: new Date(),
                    },
                })
            }

            const isFirstMember = neighborhood.members === 1

            await postgresClient.userNeighborhood.create({
                data: {
                    userId: user.id,
                    neighborhoodId: neighborhood.id,
                    joinedAt: new Date(),
                    roleInArea: isFirstMember ? "admin" : "member",
                },
            })

            await postgresClient.user.update({
                where: { email },
                data: {
                    otpVerified: true,
                    otpCode: null,
                    otpCreatedAt: null,
                },
            })


            res.status(200).json({ message: 'OTP vérifié avec succès' })
        } catch (error) {
            next(error)
        }
    }

    resendOtp: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email } = req.body

        try {
            const user = await postgresClient.user.findUnique({
                where: { email },
            })

            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' })
                return
            }

            if (user.otpVerified) {
                res.status(400).json({ error: 'OTP déjà vérifié. Aucun besoin de renvoyer le code.' })
                return
            }

            const newOtp = crypto.randomInt(100000, 999999).toString()

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Nouveau code OTP de vérification',
                text: `Bonjour ${user.firstName},\n\nVoici votre nouveau code de vérification OTP : ${newOtp}\n\nCe code est valide pendant 10 minutes.\n\nMerci.`,
            }

            await transporter.sendMail(mailOptions)

            await postgresClient.user.update({
                where: { email },
                data: {
                    otpCode: newOtp,
                    otpCreatedAt: new Date(),
                },
            })

            res.status(200).json({ message: 'Nouveau code OTP envoyé par email.' })
        } catch (error) {
            next(error)
        }
    }




    logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = (req as any).user as CurrentUser
            if (!currentUser) {
                res.status(401).json({error: 'Unauthorized'})
                return
            }

            postgresClient.user.update({
                where: {id: currentUser.id},
                data: {refreshToken: undefined}
            })

            res.cookie(refreshTokenName, '', {maxAge: 0})
            res.clearCookie(refreshTokenName, {httpOnly: true, sameSite: 'lax', secure: true})

            res.cookie(accessTokenName, '', {maxAge: 0})
            res.clearCookie(accessTokenName, {httpOnly: true, sameSite: 'lax', secure: true})

            res.status(200).json({message: 'Logout successful'})
        } catch (error) {
            next(error)
        }
    }

    handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
        try {
            const token = req.body.refreshToken || req.cookies[refreshTokenName]
            if (!token) {
                res.status(401).json({error: 'Unauthorized'})
                return
            }

            const payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as CurrentUser
            const user = await postgresClient.user.findUnique({where: {id: Number(payload.id)}})
            if (!user) {
                res.status(404).json({error: 'User not found'})
                return
            }

            const tokenExpiration = (jwt.decode(token) as any).exp * 1000
            const currentTime = Date.now()
            if (tokenExpiration < currentTime) {
                res.status(401).json({error: 'Unauthorized'})
                return
            }

            const accessToken = jwt.sign(
                {id: user.id, email: user.email, roles: user.roles as UserRole[]},
                config.ACCESS_TOKEN_SECRET,
                {expiresIn: accessTokenExpiration}
            )

            // Cookie refresh côté frontend
            res.status(200).json({accessToken})
        } catch (_) {
            res.status(401).json({error: 'Unauthorized'})
        }
    }

    isValidEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.params.email
        if (!email || typeof email !== 'string') {
            res.status(400).json({error: 'Invalid email format'})
            return
        }
        try {
            const user = await postgresClient.user.findUnique({where: {email}})
            if (user) {
                res.status(200).json({isValid: true})
            } else {
                res.status(404).json({isValid: false})
            }
        } catch (error) {
            next(error)
        }
    }

    resetPasswordCode: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {email} = req.body

        if (!email) {
            res.status(400).json({error: 'Email is required'})
            return
        }

        try {
            const user = await postgresClient.user.findUnique({where: {email}})
            if (!user) {
                res.status(404).json({error: 'User not found'})
                return
            }

            const resetCode = crypto.randomInt(100000, 999999).toString()

            await postgresClient.user.update({
                where: { email },
                data: { resetPasswordCode: resetCode }
            })

            res.status(200).json({resetPasswordCode: resetCode})
        } catch (error) {
            next(error)
        }
    }

    checkResetPasswordCode: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {email, resetPasswordCode} = req.body

        if (!email || !resetPasswordCode) {
            res.status(400).json({ isValid: false })
            return
        }

        try {
            const user = await postgresClient.user.findUnique({where: {email}})
            if (!user) {
                res.status(404).json({ isValid: false})
                return
            }

            if (user.resetPasswordCode !== resetPasswordCode) {
                res.status(400).json({isValid: false})
                return
            }

            res.status(200).json({isValid: true})
        } catch (error) {
            next(error)
        }
    }

    resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {email, newPassword} = req.body

        if (!email || !newPassword) {
            res.status(400).json({error: 'Email and new password are required'})
            return
        }
        try {
            const user = await postgresClient.user.findUnique({where: {email}})
            if (!user) {
                res.status(404).json({error: 'User not found'})
                return
            }

            const hashedPassword = await argon2.hash(newPassword)

            await postgresClient.user.update({
                where: {email},
                data: {password: hashedPassword, resetPasswordCode: null}
            })

            res.status(200).json({message: 'Password reset successfully'})
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController
