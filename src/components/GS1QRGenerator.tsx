import React, { useState, useEffect } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";

const GS1QRGenerator: React.FC = () => {
  const [gtin, setGtin] = useState("");
  const [randomGtinPrefix, setRandomGtinPrefix] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  // Generate random 8-digit prefix for GTIN
  const generateRandomGtinPrefix = () => {
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  // Generate random batch number
  const generateBatchNumber = () => {
    return `BATCH${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  // Generate random serial number
  const generateSerialNumber = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${randomStr}${timestamp}`;
  };

  // Calculate expiration date (2-5 years from now)
  const calculateExpirationDate = () => {
    const today = new Date();
    // Add random number of years between 2 and 5
    const yearsToAdd = Math.floor(Math.random() * 4) + 2; // 2 to 5 years
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + yearsToAdd);

    // Format as YYMMDD
    const year = expiryDate.getFullYear().toString().slice(-2);
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, "0");
    const day = expiryDate.getDate().toString().padStart(2, "0");

    return `${year}${month}${day}`;
  };

  // Validate GTIN input (6 digits)
  const validateGtin = (input: string) => {
    const regex = /^\d{0,6}$/;
    if (regex.test(input)) {
      setGtin(input);
      if (input.length === 6) {
        setShowInput(false);
      }
    }
  };

  // Generate GS1 data string
  const generateGS1Data = () => {
    // Combine random 8-digit prefix with user's 6-digit input
    const completeGtin = `${randomGtinPrefix}${gtin.padStart(6, "0")}`;
    // Add FNC1 (ASCII Group Separator) after variable length fields
    const fnc1 = String.fromCharCode(29); // ASCII Group Separator character
    return `01${completeGtin}10${batchNumber}${fnc1}17${expirationDate}21${serialNumber}${fnc1}`;
  };

  // Auto-update serial number every 0.5 seconds when QR is showing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!showInput && gtin.length === 6) {
      interval = setInterval(() => {
        setSerialNumber(generateSerialNumber());
        setBatchNumber(generateBatchNumber());
      }, 500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showInput, gtin]);

  // Initialize serial number, batch number, GTIN prefix and expiration date
  useEffect(() => {
    setBatchNumber(generateBatchNumber());
    setSerialNumber(generateSerialNumber());
    setRandomGtinPrefix(generateRandomGtinPrefix());
    setExpirationDate(calculateExpirationDate());
  }, []);

  // Update GTIN prefix and expiration date when resetting
  useEffect(() => {
    if (showInput) {
      setRandomGtinPrefix(generateRandomGtinPrefix());
      setExpirationDate(calculateExpirationDate());
    }
  }, [showInput]);

  return (
    <div className="gs1-container">
      {showInput ? (
        <div className="input-container">
          <h1
            style={{
              color: "#e7ff4b",
              fontSize: "1.5rem",
              marginBottom: "20px",
            }}
          >
            Bahgat MDCN QR Generator
          </h1>
          <div className="input-group">
            <label className="input-label">Enter your code</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={gtin}
              onChange={(e) => validateGtin(e.target.value)}
              maxLength={6}
              autoFocus
              style={{ fontSize: "24px" }}
            />
          </div>
          <div className="wave-background" />
        </div>
      ) : (
        <div className="qr-container">
          <QRCode
            value={generateGS1Data()}
            size={256}
            level="H"
            style={{ width: "70%", height: "auto" }}
            imageSettings={{
              src: "",
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
          <p
            style={{ color: "#e7ff4b", marginTop: "10px", fontSize: "0.8rem" }}
          >
            Bahgat MDCN QR Code
          </p>
          <button
            onClick={() => {
              setShowInput(true);
              setGtin("");
            }}
          >
            <span>Enter New Code</span>
          </button>
          <div className="wave-background" />
        </div>
      )}
    </div>
  );
};

export default GS1QRGenerator;
