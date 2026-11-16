import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// VERIFY PROMO CODE (Public for checkout)
export const verifyPromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
      return;
    }

    const formattedCode = code.trim().toUpperCase();

    const promo = await prisma.promoCode.findUnique({
      where: { code: formattedCode },
    });

    if (!promo) {
      res.status(404).json({
        success: false,
        message: "Invalid promo code",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Promo code applied! ${promo.discount}% discount`,
      promo: {
        id: promo.id,
        code: promo.code,
        discount: promo.discount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify promo code",
    });
  }
};

// CREATE PROMO CODE (Admin)
export const createPromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, discount } = req.body;

    if (!code || discount === undefined) {
      res.status(400).json({
        success: false,
        message: "Code and discount are required",
      });
      return;
    }

    const numDiscount = Number(discount);
    if (!Number.isInteger(numDiscount) || numDiscount < 1 || numDiscount > 100) {
      res.status(400).json({
        success: false,
        message: "Discount must be an integer between 1 and 100",
      });
      return;
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: String(code).trim().toUpperCase(),
        discount: numDiscount,
      },
    });

    res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      promo,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Promo code already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create promo code",
    });
  }
};

// GET ALL PROMOS (Admin)
export const getAllPromos = async (req: Request, res: Response): Promise<void> => {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      promos,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch promo codes",
    });
  }
};

// GET SINGLE PROMO BY ID
export const getPromoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid promo ID",
      });
      return;
    }

    const promo = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!promo) {
      res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      promo,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch promo code",
    });
  }
};

// UPDATE PROMO (Admin)
export const updatePromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { code, discount } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid promo ID",
      });
      return;
    }

    if (code === undefined && discount === undefined) {
      res.status(400).json({
        success: false,
        message: "Provide code or discount to update",
      });
      return;
    }

    let numDiscount: number | undefined;
    if (discount !== undefined) {
      numDiscount = Number(discount);
      if (!Number.isInteger(numDiscount) || numDiscount < 1 || numDiscount > 100) {
        res.status(400).json({
          success: false,
          message: "Discount must be an integer between 1 and 100",
        });
        return;
      }
    }

    const promo = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(code !== undefined && { code: String(code).trim().toUpperCase() }),
        ...(numDiscount !== undefined && { discount: numDiscount }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Promo code updated successfully",
      promo,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
      return;
    }

    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Promo code already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update promo code",
    });
  }
};

// DELETE PROMO (Admin)
export const deletePromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid promo ID",
      });
      return;
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Promo code deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete promo code",
    });
  }
};
