"use client";

import { TextField, Checkbox, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import ProcessingDialog from "@/components/dialogs/ProcessingDialog";
import SuccessDialog from "@/components/dialogs/SuccessDialog";

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [processingOpen, setProcessingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "") // keep digits only
      .slice(0, 16) // max 16 digits
      .replace(/(\d{4})(?=\d)/g, "$1 ") // insert space every 4 digits
      .trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(digits);
  };

  const canSubmit =
    cardNumber.replace(/\s/g, "").length === 16 && cvv.length === 3;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setProcessingOpen(true);
    setTimeout(() => {
      setProcessingOpen(false);
      setSuccessOpen(true);
    }, 3000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="rounded-lg bg-primary-variant-1 p-3 sm:p-5 md:rounded-none">
        <div>
          <h2 className="text-[16px] font-semibold md:text-xl">
            Add credit card / debit Card
          </h2>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          {/* Card details */}
          <div>
            <div className="space-y-2">
              <Stack spacing={1}>
                <TextField
                  size="medium"
                  placeholder="Card number"
                  className="w-full bg-white"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "12px", md: "16px" },
                    },
                  }}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </Stack>

              <div className="flex gap-2">
                <Stack spacing={1} className="basis-4/5">
                  <DatePicker
                    format="MM/YYYY"
                    views={["month", "year"]}
                    value={dayjs()}
                    onChange={() => {}}
                    slotProps={{
                      textField: {
                        placeholder: "Expiry date",
                        InputProps: {
                          sx: {
                            backgroundColor: "white",
                            "& .MuiInputBase-input": {
                              fontSize: { xs: "12px", md: "16px" },
                            },
                          },
                          endAdornment: null,
                        },
                      },
                    }}
                  />
                </Stack>
                <Stack spacing={1} className="basis-1/5">
                  <TextField
                    size="medium"
                    placeholder="CVV"
                    className="w-full bg-white"
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "12px", md: "16px" },
                      },
                    }}
                    value={cvv}
                    onChange={handleCvvChange}
                  />
                </Stack>
              </div>
            </div>

            {/* Agreement + card logos */}
            <div className="mt-5 flex justify-between gap-4 sm:flex-row sm:gap-7">
              <Stack spacing={1} className="flex-1">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id="agreement"
                    className="!h-fit !border-2 !bg-white !p-0"
                  />
                  <label
                    htmlFor="agreement"
                    className="md:text-xs text-[8px] text-neutral-400"
                  >
                    I acknowledge that I have read, understood and agree to
                    JoLimo Terms and Conditions and Privacy Policy
                  </label>
                </div>
              </Stack>
              <div className="flex justify-center gap-1 sm:justify-end">
                <div className="relative h-[28.5px] w-[44.25px] border border-black">
                  <Image
                    src="/images/visa-logo.png"
                    alt="Visa Logo"
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                </div>
                <div className="relative h-[28.5px] w-[44.25px] border border-black">
                  <Image
                    src="/images/mastercard-logo.png"
                    alt="Mastercard Logo"
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="bg-[#B2B2B2] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg px-4 py-3 rounded-lg w-full mt-4"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Proceed to Checkout
          </button>

          {/* Pay now / later boxes */}
        </div>
      </div>
      <ProcessingDialog open={processingOpen} />
      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </LocalizationProvider>
  );
}
