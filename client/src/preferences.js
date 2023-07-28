import { useState, useEffect } from "react";
import Switch from "react-switch";
import suprsend, {
  ChannelLevelPreferenceOptions,
  PreferenceOptions,
} from "@suprsend/web-sdk";

// -------------- Category Level Preferences -------------- //

const handleCategoryPreferenceChange = (
  data,
  subcategory,
  setPreferenceData
) => {
  const resp = suprsend.user.preferences.update_category_preference(
    subcategory.category,
    data ? PreferenceOptions.OPT_IN : PreferenceOptions.OPT_OUT
  );
  if (resp.error) {
    console.log(resp.message);
  } else {
    setPreferenceData({ ...resp });
  }
};

const handleChannelPreferenceInCategoryChange = (
  channel,
  subcategory,
  setPreferenceData
) => {
  if (!channel.is_editable) return;

  const resp = suprsend.user.preferences.update_channel_preference_in_category(
    channel.channel,
    channel.preference === PreferenceOptions.OPT_IN
      ? PreferenceOptions.OPT_OUT
      : PreferenceOptions.OPT_IN,
    subcategory.category
  );
  if (resp.error) {
    console.log(resp.message);
  } else {
    setPreferenceData({ ...resp });
  }
};

function NotificationCategoryPreferences({
  preferenceData,
  setPreferenceData,
}) {
  if (!preferenceData.sections) {
    return null;
  }
  return preferenceData.sections?.map((section, index) => {
    return (
      <div style={{ marginBottom: 24 }} key={index}>
        {section?.name && (
          <div
            style={{
              backgroundColor: "#FAFBFB",
              paddingTop: 12,
              paddingBottom: 12,
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#3D3D3D",
              }}
            >
              {section.name==="DoodleDocs"&&section.name}
            </p>
            {section.name==="DoodleDocs"&&
            <p style={{ color: "#6C727F" }}>{section.description}</p>
  }
          </div>
        )}
  
        {section.name==="DoodleDocs" &&section?.subcategories?.map((subcategory, index) => {
          return (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #D9D9D9",
                paddingBottom: 12,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#3D3D3D",
                    }}
                  >
                    {subcategory.name}
                  </p>
                  <p style={{ color: "#6C727F", fontSize: 14 }}>
                    {subcategory.description}
                  </p>
                </div>
                <Switch
                  disabled={!subcategory.is_editable}
                  onChange={(data) => {
                    handleCategoryPreferenceChange(
                      data,
                      subcategory,
                      setPreferenceData
                    );
                  }}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={20}
                  width={40}
                  onColor="#2563EB"
                  checked={subcategory.preference === PreferenceOptions.OPT_IN}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {subcategory?.channels.map((channel, index) => {
                  return (
                    <Checkbox
                      key={index}
                      value={channel.preference}
                      title={channel.channel}
                      disabled={!channel.is_editable}
                      onClick={() => {
                        handleChannelPreferenceInCategoryChange(
                          channel,
                          subcategory,
                          setPreferenceData
                        );
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}

// -------------- Channel Level Preferences -------------- //

const handleOverallChannelPreferenceChange = (
  channel,
  status,
  setPreferenceData
) => {
  const resp = suprsend.user.preferences.update_overall_channel_preference(
    channel.channel,
    status
  );
  if (resp.error) {
    console.log(resp.message);
  } else {
    setPreferenceData({ ...resp });
  }
};

function ChannelLevelPreferernceItem({ channel, setPreferenceData }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #D9D9D9",
        borderRadius: 5,
        padding: "12px 24px",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={() => setIsActive(!isActive)}
      >
        <p
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#3D3D3D",
          }}
        >
          {channel.channel}
        </p>
        <p style={{ color: "#6C727F", fontSize: 14 }}>
          {channel.is_restricted
            ? "Allow required notifications only"
            : "Allow all notifications"}
        </p>
      </div>
      {isActive && (
        <div style={{ marginTop: 12, marginLeft: 24 }}>
          <p
            style={{
              color: "#3D3D3D",
              fontSize: 16,
              fontWeight: 500,
              marginTop: 12,
              borderBottom: "1px solid #E8E8E8",
            }}
          >
            {channel.channel} Preferences
          </p>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <input
                    type="radio"
                    name={`all- ${channel.channel}`}
                    value={true}
                    id={`all- ${channel.channel}`}
                    checked={!channel.is_restricted}
                    onChange={() => {
                      handleOverallChannelPreferenceChange(
                        channel,
                        ChannelLevelPreferenceOptions.ALL,
                        setPreferenceData
                      );
                    }}
                  />
                </div>
                <label
                  htmlFor={`all- ${channel.channel}`}
                  style={{ marginLeft: 12 }}
                >
                  All
                </label>
              </div>
              <p style={{ color: "#6C727F", fontSize: 14, marginLeft: 22 }}>
                Allow All Notifications, except the ones that I have turned off
              </p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <input
                    type="radio"
                    name={`required- ${channel.channel}`}
                    value={true}
                    id={`required- ${channel.channel}`}
                    checked={channel.is_restricted}
                    onChange={() => {
                      handleOverallChannelPreferenceChange(
                        channel,
                        ChannelLevelPreferenceOptions.REQUIRED,
                        setPreferenceData
                      );
                    }}
                  />
                </div>
                <label
                  htmlFor={`required- ${channel.channel}`}
                  style={{ marginLeft: 12 }}
                >
                  Required
                </label>
              </div>
              <p style={{ color: "#6C727F", fontSize: 14, marginLeft: 22 }}>
                Allow only important notifications related to account and
                security settings
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChannelLevelPreferences({ preferenceData, setPreferenceData }) {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#FAFBFB",
          paddingTop: 12,
          paddingBottom: 12,
          marginBottom: 18,
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#3D3D3D",
          }}
        >
          What notifications to allow for channel?
        </p>
      </div>
      <div>
        {preferenceData.channel_preferences ? (
          <div>
            {preferenceData.channel_preferences?.map((channel, index) => {
              return (
                <ChannelLevelPreferernceItem
                  key={index}
                  channel={channel}
                  setPreferenceData={setPreferenceData}
                />
              );
            })}
          </div>
        ) : (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
}

// -------------- Main component -------------- //

export default function Preferences() {
  const [preferenceData, setPreferenceData] = useState();

  useEffect(() => {
    // call suprsend.identify method before calling below method
    suprsend.user.preferences.get_preferences().then((resp) => {
      if (resp.error) {
        console.log(resp.message);
      } else {
        setPreferenceData(resp);
      }
    });

    // listen for update in preferences data
    suprsend.emitter.on("preferences_updated", (preferenceData) => {
      setPreferenceData({ ...preferenceData });
    });

    // listen for errors
    suprsend.emitter.on("preferences_error", (error) => {
      console.log("ERROR:", error);
    });
  }, []);

  if (!preferenceData) return <p>Loading...</p>;
  return (
    <div style={{ margin: 24 }}>
      <h3 style={{ marginBottom: 24 }}>Notification Preferences</h3>
      <NotificationCategoryPreferences
        preferenceData={preferenceData}
        setPreferenceData={setPreferenceData}
      />
      <ChannelLevelPreferences
        preferenceData={preferenceData}
        setPreferenceData={setPreferenceData}
      />
    </div>
  );
}

// -------------- Custom Checkbox Component -------------- //
function Checkbox({ title, value, onClick, disabled }) {
  const selected = value === PreferenceOptions.OPT_IN;

  return (
    <div
      style={{
        border: "0.5px solid #B5B5B5",
        display: "inline-flex",
        padding: "0px 10px 0px 4px",
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={onClick}
    >
      <Circle selected={selected} disabled={disabled} />
      <p
        style={{
          marginLeft: 8,
          color: "#6C727F",
          marginTop: 1,
          fontWeight: 500,
          // paddingBottom: 4,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function Circle({ selected, disabled }) {
  const bgColor = selected
    ? disabled
      ? "#BDCFF8"
      : "#2463EB"
    : disabled
    ? "#D0CFCF"
    : "#FFF";

  return (
    <div
      style={{
        height: 20,
        width: 20,
        borderRadius: 100,
        border: "0.5px solid #A09F9F",
        backgroundColor: bgColor,
        marginTop: 3.6,
      }}
    />
  );
}

