import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { a11yProps, TabPanel } from "../exams/ExamModalBody";

function ViewDetails({ Header, labels, data }) {
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            {Header}
            <Tabs value={tabValue} onChange={handleChange} centered>
                {labels.map((label, index) => (
                    <Tab label={label} {...a11yProps(index)} />
                ))}
            </Tabs>
            {data.map((Value, index) => (
                <TabPanel value={tabValue} index={index}>
                    {Value}
                </TabPanel>
            ))}
        </>
    );
}

export default ViewDetails;
