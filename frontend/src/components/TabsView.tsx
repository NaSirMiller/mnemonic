import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

import { TabContext, TabList, TabPanel } from "@mui/lab";
export interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsViewProps {
  tabs: TabItem[];
  initial?: string; // initial selected tab
}

export function TabsView({ tabs, initial }: TabsViewProps) {
  const [value, setValue] = React.useState(initial ?? tabs[0]?.value ?? "");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
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
