import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    const { firstname, lastname, email, password, userId } = req.body;

    if (!firstname || !lastname || !email || !password || !userId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const token = jwt.sign(
        { firstname, lastname, email, userId },
        process.env.JWT_SECRET as string,
        { algorithm: "HS256", expiresIn: "30d" }
    );

    res.status(200).json({ token });
}