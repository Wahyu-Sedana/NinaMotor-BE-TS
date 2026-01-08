import { Request, Response } from "express";
import prisma from "../helpers/database";

export async function getTranslations(req: Request, res: Response) {
  try {
    const lang = (req.query.lang as string) || "en";

    // optional: whitelist language
    const allowedLangs = ["en", "zh"];
    if (!allowedLangs.includes(lang)) {
      return res.status(400).json({
        message: "Invalid language",
      });
    }

    const data = await prisma.tb_translation.findMany({
      where: { lang },
      select: {
        key: true,
        value: true,
      },
    });

    const translations = data.reduce(
      (acc, item) => {
        acc[item.key] = item.value;
        return acc;
      },
      {} as Record<string, string>
    );

    return res.json({
      lang,
      translations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch translations",
    });
  }
}
