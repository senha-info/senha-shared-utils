import os from "node:os";

const nets = os.networkInterfaces();

export function getIPAddress(): { ipv4: string; ipv6: string } {
  let ipv4 = "";
  let ipv6 = "";

  for (const key in nets) {
    if (key === "Ethernet" || key === "Wi-Fi" || key === "NIC1") {
      const connection = nets[key];

      if (!connection) {
        break;
      }

      for (const net of connection) {
        if (net.family === "IPv4" || net.family === "IPv6") {
          if (net.family === "IPv4") {
            ipv4 = net.address;
          } else {
            ipv6 = net.address;
          }
        }
      }
    }
  }

  return {
    ipv4,
    ipv6,
  };
}
