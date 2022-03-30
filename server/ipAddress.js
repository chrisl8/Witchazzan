import os from "os";

const interfaces = os.networkInterfaces();

const ipAddress = () => {
  let ip = false;
  let firstInterface;
  for (const networkInterface in interfaces) {
    if (
      interfaces.hasOwnProperty(networkInterface) &&
      networkInterface !== "lo" &&
      firstInterface === undefined
    ) {
      firstInterface = networkInterface;
    }
  }
  if (firstInterface) {
    ip = interfaces[firstInterface][0].address;
  }
  return ip;
};

export default ipAddress;
