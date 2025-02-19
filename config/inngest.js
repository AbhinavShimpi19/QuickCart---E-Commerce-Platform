import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk", // The unique ID for this function
    event: "clerk/user.created", // The event you are listening for
  },
  // Define the function handler for the event
  async ({ event }) => {
    // You can access event details like event.data here
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    };
    await connectDB();
    await User.create(userData);
  }
);

// Inngest Function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-from-clerk',
    event: 'clerk/user.updated' // Fixed the typo here
  },
  async ({ event }) => {
    // You can access event details like event.data here
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData); // Fixed the typo here
  }
);

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
    event: 'clerk/user.deleted'
  },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
