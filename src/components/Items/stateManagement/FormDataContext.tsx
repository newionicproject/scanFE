/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FormDataContext.js
import React, { createContext, useContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const FormDataContext = createContext<any>(null);

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }: any) => {  
  const [itemDetails, setItemDetails] = useState({
    itemName: "",
    amount: 0.0,
    offerPrice: "",
    cuponCode: "",
    description: "",
    spiceLevel: "",
    isSpecial: false,
    is_veg: false,
    mongoId: "",
  });
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<any>([]);
  const [expiredOn, setExpiredOn] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [indexedImage, setIndexedImage] = useState(0);
  const [fileSrc, setFileSrc] = useState(
    "http://h-app-scanner.s3-website-ap-southeast-2.amazonaws.com/dummy-post-horisontal.jpg"
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const updateMenuItems = (newMenuItems: any) => {
    setMenuItems(newMenuItems);
  };
  const [text, setText]= useState("Add")
  const [header, setHeader] = useState("Item Creation")
  const[show, setShow] = useState(true)
  return (
    <FormDataContext.Provider
      value={{
        itemDetails,
        setItemDetails,
        open,
        setOpen,
        indexedImage,
        setIndexedImage,
        fileSrc,
        setFileSrc,
        isPopupOpen,
        setIsPopupOpen,
        expiredOn,
        setExpiredOn,
        menuItems,
        setMenuItems,
        updateMenuItems,
        text, setText ,
        header, setHeader ,
        show, setShow
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};
