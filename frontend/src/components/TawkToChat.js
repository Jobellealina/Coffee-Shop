import { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/680606c92a762a1910951e38/1ipbol0oe"; // Use your actual Widget ID
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Only run this effect once when the component mounts

  return null; // Since it's a side-effect component, it doesn't need to render anything.
};

export default TawkToChat;
