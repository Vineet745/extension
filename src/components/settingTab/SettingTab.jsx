import React, { useEffect, useState } from "react";
import {
  enableGroupsAndCommunity,
  getMobileNumbers,
} from "../../service/api/mobileApi";
import { styles } from "./settingTabStyle";

const SettingTab = ({ item }) => {
  const [groupEnabled, setGroupEnabled] = useState(0);
  const [communityEnabled, setCommunityEnabled] = useState(0);
  const [enableStatus, setEnableStatus] = useState(false);

  useEffect(() => {
    handleNumbers();
  }, []);

  const handleNumbers = async () => {
    try {
      const { data } = await getMobileNumbers();
      const targetNumber = item?.mobile_number;
      const result = data?.mobile_numbers?.data.find(
        (item) => item.mobile_number == targetNumber
      );
      setGroupEnabled(result.group_enabled);
      setCommunityEnabled(result.community_enabled);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Switch Enable

  const handleSwitch = async ({ flag, value }) => {
    const requiredData = {
      mobile_number: "8236930373",
      flag: flag,
      value: value,
    };
    try {
      await enableGroupsAndCommunity(requiredData);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div style={styles.container}>
      {[
        {
          label: "Enable Group",
          value: groupEnabled,
          set: setGroupEnabled,
          flag: 1,
        },
        {
          label: "Enable Community",
          value: communityEnabled,
          set: setCommunityEnabled,
          flag: 2,
        },
        {
          label: "Enable Status",
          value: enableStatus,
          set: setEnableStatus,
          flag: 3,
        },
      ].map((item, idx) => (
        <div style={styles.switchContainer} key={idx}>
          <label style={styles.switchLabel}>{item.label}</label>
          <label style={styles.switch}>
            <input
              type="checkbox"
              checked={item.value}
              onChange={() => {
                const newValue = !item.value;
                item.set(newValue);
                handleSwitch({ flag: item.flag, value: newValue ? 1 : 0 });
              }}
              style={styles.input}
            />
            <span
              style={{
                ...styles.slider,
                backgroundColor: item.value ? "#4caf50" : "#ccc",
              }}
            >
              <span
                style={{
                  ...styles.sliderBefore,
                  transform: item.value ? "translateX(26px)" : "translateX(0)",
                }}
              />
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default SettingTab;
