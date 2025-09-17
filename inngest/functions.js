import { inngest } from "./client";
import prisma from "@/lib/prisma"; // default import theek kiya


// Inngest Function to save user data to a database 
export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-create' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: getEmail(data),
                name: getName(data),
                image: data.image_url || null,
            }
        });
    }
);

// Inngest Function to update user data to a database 
export const syncUserUpdation = inngest.createFunction(
    { id: 'sync-user-update' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: getEmail(data),
                name: getName(data),
                image: data.image_url || null,
            }
        });
    }
);

// Inngest Function to delete user data from a database 
export const syncUserDeletion = inngest.createFunction(
    { id: 'sync-user-delete' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            where: { id: data.id }
        });
    }
);