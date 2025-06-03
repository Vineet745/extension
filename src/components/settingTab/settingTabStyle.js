 export const styles = {
    container: {
      padding: 20,
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      marginBottom: 20,
    },
    switchContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
      maxWidth: 400,
    },
    switchLabel: {
      fontSize: 16,
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: 50,
      height: 24,
    },
    input: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      borderRadius: 34,
      transition: "0.4s",
    },
    sliderBefore: {
      content: '""',
      position: "absolute",
      height: 18,
      width: 18,
      left: 3,
      bottom: 3,
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "0.4s",
    },
  };