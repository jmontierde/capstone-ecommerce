import React, { Component } from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";
import { FacebookProvider, CustomChat } from "react-facebook";
const Messenger = () => {
  return (
    // <MessengerCustomerChat
    //   pageId="120127534518307"
    //   appId="1258869378161194"
    //   themeColor="#0084ff"
    // />
    <FacebookProvider appId="1258869378161194" chatSupport>
      <CustomChat pageId="120127534518307" minimized={true} />
    </FacebookProvider>
  );
};

export default Messenger;
