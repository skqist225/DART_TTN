import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button } from "flowbite-react";

function MyDrawer({ Children, label, anchor = "top" }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => event => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    return (
        <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>{label}</Button>
            <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                <Box
                    sx={{
                        width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
                    }}
                    role='presentation'
                    onClick={toggleDrawer(anchor, false)}
                    onKeyDown={toggleDrawer(anchor, false)}
                >
                    {Children}
                </Box>
            </Drawer>
        </React.Fragment>
    );
}

export default MyDrawer;
