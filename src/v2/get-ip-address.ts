import os from 'node:os';

export interface IPAddressResult {
  ipv4: string;
  ipv6: string;
}

/**
 * Gets the primary non-internal IP address of the current machine.
 * Evaluates dynamically on each call and supports Windows, Linux, macOS, and containerized environments.
 *
 * @returns {IPAddressResult} Object with ipv4 and ipv6 strings
 */
export function getIPAddress(): IPAddressResult {
  const nets = os.networkInterfaces();
  let ipv4 = '';
  let ipv6 = '';

  for (const name of Object.keys(nets)) {
    const netList = nets[name];
    if (!netList) continue;

    for (const net of netList) {
      if (net.internal) continue;

      const family = String(net.family);

      if (family === 'IPv4' && !ipv4) {
        ipv4 = net.address;
      } else if (family === 'IPv6' && !ipv6) {
        if (!net.address.startsWith('fe80:')) {
          ipv6 = net.address;
        }
      }
    }

    if (ipv4 && ipv6) {
      break;
    }
  }

  return {
    ipv4: ipv4 || '127.0.0.1',
    ipv6: ipv6 || '::1',
  };
}
