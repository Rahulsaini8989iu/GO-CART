import { inngest } from "./client";
import prisma from "@/lib/prisma";

function getEmail(data) {
  return data.email_addresses?.[0]?.email_address || "";
}

function getName(data) {
  return data.first_name && data.last_name
    ? `${data.first_name} ${data.last_name}`
    : data.first_name || "Unknown";
}

// Inngest Function to save user data to a database 
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: getEmail(data),
        name: getName(data),
        image: data.image_url || null,
      },
    });
  }
);

// Inngest Function to update user data to a database 
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: getEmail(data),
          name: getName(data),
          image: data.image_url || null,
        },
      });
    } catch (err) { }
  }
);

// Inngest Function to delete user data from a database 
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    try {
      await prisma.user.delete({
        where: { id: data.id },
      });
    } catch (err) { }
  }
);

//Inngest Function to delete cuopon  on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon/expired" },
  async ({ event, step }) => {
    const { data } = event
    const expiryDate = new Date(data.expires_at)
    await step.sleepUntil('wait-for-expiry', expiryDate)

    await step.run('delete-coupon-from-database', async () => {
      await prisma.coupon.delete({
        where: { code: data.code }
      })
    })
  }
)