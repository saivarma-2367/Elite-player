const Slot = require('./slotsModel');

exports.getSlotsInfo = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const data = await Slot.find();

    console.log("Fetched slots for today:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching today's slots:", err);
    res.status(500).json({ message: "Error occurred fetching today's slots", error: err });
  }
};

exports.bookSlot = async (req, res) => {

  let { courtId, playerId, slotTime, sport } = req.body;

  slotTime = new Date(slotTime);


  if (isNaN(slotTime.getTime())) {
    console.error("Invalid Date detected:", slotTime);
    return res.status(400).json({ message: "Invalid slotTime format." });
  }



  try {
    const normalizedTime = new Date(slotTime);
    normalizedTime.setSeconds(0, 0);

    console.log("Normalized slotTime:", normalizedTime);

    const existingSlot = await Slot.findOne({
      courtId,
      slotTime: normalizedTime,
      sport
    });

    console.log("Checking for existing slot with:", { courtId, slotTime: normalizedTime, sport });

    if (existingSlot) {
      console.warn("Slot already exists:", existingSlot);
      return res.status(400).json({ message: "Slot already exists. Booking not allowed." });
    }

    const newSlot = new Slot({
      courtId,
      playerId,
      slotTime: normalizedTime,
      isBooked: true,
      sport
    });

    await newSlot.save();

    console.log("Successfully booked slot:", newSlot);

    res.status(201).json({
      message: "Slot successfully booked",
      slot: newSlot
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Error booking slot", error: err });
  }
};
