import React, { useState, useEffect } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";

const GS1QRGenerator: React.FC = () => {
  const [gtin, setGtin] = useState("");
  const [batchNumber] = useState("BATCH123"); // Example static batch number
  const [expirationDate] = useState("231231"); // Example expiration date (YYMMDD)
  const [serialNumber, setSerialNumber] = useState("");

  // Generate random serial number
  const generateSerialNumber = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${randomStr}${timestamp}`;
  };

  // Validate GTIN input (6 digits)
  const validateGtin = (input: string) => {
    const regex = /^\d{0,6}$/;
    if (regex.test(input)) {
      setGtin(input);
    }
  };

  // Generate GS1 data string
  const generateGS1Data = () => {
    // Format: AI(01) + GTIN + AI(10) + Batch + AI(17) + ExpDate + AI(21) + SerialNumber
    return `01${gtin.padStart(
      6,
      "0"
    )}10${batchNumber}17${expirationDate}21${serialNumber}`;
  };

  // Handle regenerate serial number
  const handleRegenerateSerial = () => {
    setSerialNumber(generateSerialNumber());
  };

  // Initialize serial number if not set
  useEffect(() => {
    if (!serialNumber) {
      handleRegenerateSerial();
    }
  }, []);

  return (
    <div
      className="gs1-container"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1>GS1 Data Matrix Generator</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Enter GTIN (6 digits):
          <input
            type="text"
            value={gtin}
            onChange={(e) => validateGtin(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
            maxLength={6}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Batch Number: {batchNumber}</p>
        <p>Expiration Date: {expirationDate}</p>
        <p>Serial Number: {serialNumber}</p>
        <button
          onClick={handleRegenerateSerial}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generate New Serial Number
        </button>
      </div>

      {gtin.length === 6 && (
        <div style={{ textAlign: "center" }}>
          <QRCode value={generateGS1Data()} size={256} level="H" />
          <p style={{ marginTop: "10px" }}>GS1 Data: {generateGS1Data()}</p>
        </div>
      )}
    </div>
  );
};

export default GS1QRGenerator;
