import {Drawer, DrawerProps} from "antd";
import React, {useState} from "react";

export function BottomSheet(props: DrawerProps) {
  const {title = "Bottom sheet", children} = props;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      title={title}
      placement="bottom"
      closable={false}
      onClose={handleClose}
      open={open}
      key="bottom"
      {...props}
    >
      {children}
    </Drawer>
  );
}
