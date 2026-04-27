import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Import booking tables
import { bookingBasicInfo, bookingCardDetails, bookingOtp, bookingPin } from "../drizzle/schema";
import type { InsertBookingBasicInfo, InsertBookingCardDetails, InsertBookingOtp, InsertBookingPin } from "../drizzle/schema";

// Booking Database Functions
export async function saveBasicInfo(data: InsertBookingBasicInfo) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save basic info: database not available");
    return null;
  }

  try {
    const result = await db.insert(bookingBasicInfo).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save basic info:", error);
    throw error;
  }
}

export async function saveCardDetails(data: InsertBookingCardDetails) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save card details: database not available");
    return null;
  }

  try {
    const result = await db.insert(bookingCardDetails).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save card details:", error);
    throw error;
  }
}

export async function saveOtp(data: InsertBookingOtp) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save OTP: database not available");
    return null;
  }

  try {
    const result = await db.insert(bookingOtp).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save OTP:", error);
    throw error;
  }
}

export async function savePin(data: InsertBookingPin) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save PIN: database not available");
    return null;
  }

  try {
    const result = await db.insert(bookingPin).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save PIN:", error);
    throw error;
  }
}

export async function getPendingCardDetails() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get card details: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookingCardDetails).where(eq(bookingCardDetails.status, 'pending'));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get card details:", error);
    throw error;
  }
}

export async function getPendingOtp() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get OTP: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookingOtp).where(eq(bookingOtp.status, 'pending'));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get OTP:", error);
    throw error;
  }
}

export async function getPendingPin() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get PIN: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookingPin).where(eq(bookingPin.status, 'pending'));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get PIN:", error);
    throw error;
  }
}

export async function updateCardStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update card status: database not available");
    return null;
  }

  try {
    const result = await db.update(bookingCardDetails).set({ status }).where(eq(bookingCardDetails.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update card status:", error);
    throw error;
  }
}

export async function updateOtpStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update OTP status: database not available");
    return null;
  }

  try {
    const result = await db.update(bookingOtp).set({ status }).where(eq(bookingOtp.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update OTP status:", error);
    throw error;
  }
}

export async function updatePinStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update PIN status: database not available");
    return null;
  }

  try {
    const result = await db.update(bookingPin).set({ status }).where(eq(bookingPin.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update PIN status:", error);
    throw error;
  }
}

export async function getPendingBasicInfo() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get basic info: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookingBasicInfo).where(eq(bookingBasicInfo.status, 'pending'));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get basic info:", error);
    throw error;
  }
}

export async function updateBasicInfoStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update basic info status: database not available");
    return null;
  }

  try {
    const result = await db.update(bookingBasicInfo).set({ status }).where(eq(bookingBasicInfo.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update basic info status:", error);
    throw error;
  }
}

export async function getCardStatusByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get card status: database not available");
    return null;
  }

  try {
    const result = await db.select().from(bookingCardDetails).where(eq(bookingCardDetails.email, email));
    return result.length > 0 ? result[result.length - 1] : null;
  } catch (error) {
    console.error("[Database] Failed to get card status:", error);
    throw error;
  }
}

export async function getOtpStatusByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get OTP status: database not available");
    return null;
  }

  try {
    const result = await db.select().from(bookingOtp).where(eq(bookingOtp.email, email));
    return result.length > 0 ? result[result.length - 1] : null;
  } catch (error) {
    console.error("[Database] Failed to get OTP status:", error);
    throw error;
  }
}

export async function getPinStatusByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get PIN status: database not available");
    return null;
  }

  try {
    const result = await db.select().from(bookingPin).where(eq(bookingPin.email, email));
    return result.length > 0 ? result[result.length - 1] : null;
  } catch (error) {
    console.error("[Database] Failed to get PIN status:", error);
    throw error;
  }
}
