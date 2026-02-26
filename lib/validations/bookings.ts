import { z } from "zod";

type BookingValidationTranslator = (key: string) => string;

const serviceTypeValues = ["CORPORATE", "PRIVATE", "WEDDING", "VIP"] as const;

export const createBookingApiSchema = z.object({
  serviceTierId: z.string().min(1),
  menuId: z.string().nullable().optional(),
  chefProfileId: z.string().nullable().optional(),
  serviceType: z.enum(serviceTypeValues),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/),
  eventTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  guestCount: z.coerce.number().int().min(1).max(100000),
  venue: z.string().min(2).max(300),
  venueAddress: z.string().max(500).nullable().optional(),
  specialRequests: z.string().max(2000).nullable().optional(),
  contactName: z.string().min(2).max(100),
  contactPhone: z.string().regex(/^[+]?[0-9]{8,15}$/),
  contactEmail: z.string().email().max(320),
});

export function getCreateBookingSchema(t: BookingValidationTranslator) {
  return z.object({
    serviceTierId: z.string().min(1, t("serviceTierRequired")),
    menuId: z.string().optional(),
    chefProfileId: z.string().optional(),
    serviceType: z.enum(serviceTypeValues, {
      required_error: t("serviceTypeRequired"),
    }),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("eventDateInvalid"))
      .refine((value) => {
        const selected = new Date(`${value}T00:00:00`);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return selected >= today;
      }, t("eventDateFuture")),
    eventTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, t("eventTimeInvalid")),
    guestCount: z.coerce
      .number()
      .int(t("guestCountInteger"))
      .min(1, t("guestCountMin"))
      .max(100000, t("guestCountMax")),
    venue: z
      .string()
      .min(2, t("venueMin"))
      .max(300, t("venueMax")),
    venueAddress: z.string().max(500, t("venueAddressMax")).optional(),
    specialRequests: z.string().max(2000, t("specialRequestsMax")).optional(),
    contactName: z
      .string()
      .min(2, t("contactNameMin"))
      .max(100, t("contactNameMax")),
    contactPhone: z
      .string()
      .regex(/^[+]?[0-9]{8,15}$/, t("contactPhoneInvalid")),
    contactEmail: z
      .string()
      .email(t("contactEmailInvalid"))
      .max(320, t("contactEmailMax")),
  });
}

export type CreateBookingData = z.infer<ReturnType<typeof getCreateBookingSchema>>;
