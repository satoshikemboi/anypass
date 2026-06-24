import Ticket from "../models/Ticket.js";

// GET ALL
export const getTickets = async (req, res) => {
    console.log("=== GET /api/tickets route hit ==="); // 1. Check if this prints
    
    try {
      // Force Mongoose to timeout if the cluster doesn't respond in 3 seconds
      const tickets = await Ticket.find().maxTimeMS(3000); 
      
      console.log(`Fetched ${tickets.length} tickets successfully.`);
      return res.status(200).json(tickets);
    } catch (err) {
      console.error("❌ Error caught inside getTickets controller:", err.message);
      return res.status(500).json({
        message: err.message,
      });
    }
  };

// CREATE
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE
export const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      message: "Ticket deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};