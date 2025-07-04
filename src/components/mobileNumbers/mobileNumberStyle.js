
export const styles = {
  mobileCardStyle: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid grey",
    justifyContent: "space-between",
  },
  configureButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease",
    fontFamily:"Montserrat"
  },
  automationButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease",
    fontFamily:"Montserrat"
  },
  addNumberButton:{
  padding: "10px 20px",
  // background: "linear-gradient(135deg, #007bff, #0056b3)", 
  background:"#25D366",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  // fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  fontWeight:"Montserrat"
  },
  inputBox: {
    padding: "10px",
    width: "95%",
    //     maxWidth: "400px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    fontFamily:"Montserrat"
//     marginTop: "10px",
  },
  deleteButton: {
  padding: "10px",
  backgroundColor: "#dc3545", // Bootstrap's danger red
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  transition: "background-color 0.3s ease",
  fontFamily:"Montserrat"
},
modalOverlay: {
    position: "fixed",
    bottom: 300,
    left: 150,
    // backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.8)",
    // marginTop:"20px"
  },
};
