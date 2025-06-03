import React, { useEffect, useState } from "react";
import { addMobileNumber, deleteMobileNumber, getMobileNumbers } from "../../service/api/mobileApi";
import { styles } from "./mobileNumberStyle";
import { useNavigate } from "react-router-dom";

const MobileNumbers = () => {
  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleNumbers();
  }, []);

  const handleNumbers = async () => {
    try {
      const { data } = await getMobileNumbers();
      setNumbers(data?.mobile_numbers?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddNumber = async () => {
    const requiredData = {
      mobile_number: inputValue,
    };
    try {
      const { data } = await addMobileNumber(requiredData);
      if (data) {
        setInputValue("");
        handleNumbers();
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const handleDeleteClick = (number) => {
    setSelectedNumber(number);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Call delete API here if available
      await deleteMobileNumber(selectedNumber)
      setIsModalOpen(false);
      setSelectedNumber(null);
      handleNumbers();
    } catch (error) {
      console.log("Delete error", error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "left" }}>Mobile Numbers</h1>

      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Mobile Number"
        style={styles.inputBox}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <button
          style={styles.addNumberButton}
          onClick={handleAddNumber}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Add Number
        </button>
      </div>

      {numbers.map((item, index) => (
        <div key={item.id} style={styles.mobileCardStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h4>{index + 1}.</h4>
            <h4 style={{ marginLeft: 10 }}>{item.mobile_number}</h4>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={styles.configureButton}
              onClick={() => navigate("/product", { state: { item } })}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Configure
            </button>

            <button
              style={styles.automationButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e7e34")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Automation
            </button>

            <button
              style={styles.deleteButton}
              onClick={() => handleDeleteClick(item)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Are you sure you want to delete this number?</h3>
            <p>{selectedNumber?.mobile_number}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: 4 }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: 4,cursor:"pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNumbers;
