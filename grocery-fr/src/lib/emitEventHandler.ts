import axios from "axios";

const emitEventHandler = async (event: string, data: any, socketId?: any) => {
  const { data: res } = await axios.post(
    `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,
    { event, data, socketId },
  );
  return res;
};

export default emitEventHandler;
