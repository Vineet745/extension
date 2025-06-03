import React, { useEffect, useState } from "react";
import { addGroups, getGroups } from "../../service/api/mobileApi";
import SettingTab from "../settingTab/SettingTab";
import { styles } from "./publishOptionsStyle";
import { useLocation, useNavigate } from "react-router-dom";

const PublishOptions = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setgroups] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedGroups, setselectedGroups] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { item, selectedProducts } = location.state || {};


  useEffect(() => {
    if (activeTab === "groups" || activeTab === "community") {
      getGroupsAndCommunity();
    }
  }, [activeTab]);


  


  //   Get groups and community

  const getGroupsAndCommunity = async () => {
    const type =
      activeTab === "groups" ? 1 : activeTab === "community" ? 2 : null;

    if (!type) return;

    const requiredData = {
      mobile_number_id: item?.id,
      type: type,
    };
    try {
      const { data } = await getGroups(requiredData);
      setgroups(data?.whatsapp_type_names?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  //  Get Group and Community

  const renderContent = () => {
    switch (activeTab) {
      case "groups":
        return <GroupCard />;
      case "community":
        return <GroupCard />;
      case "settings":
        return <SettingTab item={item} />;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = (product) => {
  setselectedGroups((prevSelected) => {
    const exists = prevSelected.some((p) => p.id === product.id);
    if (exists) {
      return prevSelected.filter((p) => p.id !== product.id);
    } else {
      return [...prevSelected, product];
    }
  });
};

  //   Group card Component

  const GroupCard = () => {
    return (
      <div>
        {groups && groups.length > 0 ? (
          groups.map((group, index) => (
            <div key={index} style={styles.groupWrapper}>
              {/* <img src="" alt="" /> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>{index + 1}. </h2>
                <h3 style={{ textAlign: "left", marginLeft: "10px" }}>
                  {group.name}
                </h3>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteClick(item)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#c82333")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                Delete
              </button>
              {/* <p> {group.id}</p> */}
            </div>
          ))
        ) : (
          <p>No groups found.</p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={styles.addNumberButton}
            // onClick={() => navigate("/published", { state: { item } })}
            // onClick={()=>sendWhatsAppMessagesToGroupsAndCommunities(selectedGroups,selectedProducts)}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  //   Add Group or community

  const handleAddGroup = async () => {
    const requiredData = {
      name: inputValue,
      types: activeTab == "groups" ? "1" : "2",
      mobile_number_id: item?.id,
    };
    try {
      const data = await addGroups(requiredData);
      if (data) {
        setInputValue("");
        getGroupsAndCommunity();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", width: 600, height: 400 }}>
      <h3 onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </h3>
      <h2 style={{ textAlign: "left" }}>Groups & community</h2>
      <div style={styles.tabsContainer}>
        {["groups", "community", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.activeButton,
              borderBottom: activeTab === tab ? "3px solid #007bff" : "none",
              color: activeTab === tab ? "#007bff" : "#333",
              fontWeight: activeTab === tab ? "bold" : "normal",
            }}
          >
            {tab === "groups"
              ? "Groups"
              : tab === "community"
              ? "Community"
              : "Settings"}
          </button>
        ))}
      </div>

      {activeTab == "groups" || activeTab == "community" ? (
        <>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter Group/Community Name"
            style={styles.inputBox}
          />
          <div style={styles.buttonWrapper}>
            <button
              style={styles.addNumberButton}
              onClick={handleAddGroup}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Add {activeTab == "groups" ? "groups" : "community"}
            </button>
          </div>
        </>
      ) : null}

      <div style={{ padding: "20px 0" }}>{renderContent()}</div>
    </div>
  );
};

export default PublishOptions;
