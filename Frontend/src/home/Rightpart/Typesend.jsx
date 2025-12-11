import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import useSendMessage from "../../context/useSendMessage.js";

function Typesend() {
  const [message, setMessage] = useState("");
  const { sendMessages } = useSendMessage();

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    await sendMessages(message);
    setMessage("");
  };

  return (
   <form onSubmit={handleSubmit}>
  <div className="flex items-center space-x-2 h-[8vh] bg-gray-800 px-4">
    
    <input
      type="text"
      placeholder="Type here"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="flex-1 border border-gray-700 rounded-xl outline-none px-4 py-3"
    />
    
    <button type="submit" className="p-2">
      <IoSend className="text-3xl" />
    </button>
    
  </div>
</form>


  );
}

export default Typesend;
