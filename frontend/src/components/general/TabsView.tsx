import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsViewProps {
  tabs: TabItem[];
  initial?: string;
  tabColor?: string;
  selectedTabColor?: string;
  indicatorColor?: string;
}

export function TabsView({
  tabs,
  initial,
  tabColor = "#727272ff",
  selectedTabColor = "#fff",
  indicatorColor = "#2f4872",
}: TabsViewProps) {
  const [value, setValue] = React.useState(initial ?? tabs[0]?.value ?? "");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            sx={{
              "& .MuiTab-root": {
                color: tabColor,
              },
              "& .Mui-selected": {
                color: `${selectedTabColor} !important`,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: indicatorColor,
              },
            }}
          >
            {tabs.map((t) => (
              <Tab key={t.value} label={t.label} value={t.value} />
            ))}
          </TabList>
        </Box>

        {tabs.map((t) => (
          <TabPanel key={t.value} value={t.value}>
            {t.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
