"use client";

import { useState, FormEvent } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export default function BookingForm() {
  const [service, setService] = useState("Airport Transfer");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    setService(event.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = `Quote Request: Pickup from ${pickup}`;
    window.location.href = `https://wa.me/962796227227?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      id="bookingForm"
      className="lg:w-1/3 w-full bg-white rounded shadow-2xl p-8"
    >
      <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2">
        Get Your Quote
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Transparent pricing. No hidden fees.
      </p>

      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Service Type</InputLabel>
            <Select
              value={service}
              onChange={handleServiceChange}
              label="Service Type"
              className="bg-gray-50"
            >
              <MenuItem value="Airport Transfer">Airport Transfer</MenuItem>
              <MenuItem value="City-to-City">City-to-City</MenuItem>
              <MenuItem value="Hourly Hire">Hourly Hire</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Pickup Location"
            placeholder="e.g. QAIA Airport"
            variant="outlined"
            size="small"
            required
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Drop-off"
            placeholder="e.g. Amman City"
            variant="outlined"
            size="small"
            required
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="bg-gray-50"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="bg-[#111111]! text-white! font-bold py-4 rounded hover:bg-[#c5a059]! hover:text-[#111111]! transition duration-300"
          sx={{
            textTransform: "none",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "16px",
          }}
        >
          CHECK RATES & BOOK
        </Button>
      </form>
    </div>
  );
}
