import { message } from "antd";

const useCustomMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (content: any) => {
    messageApi.open({
      type: "success",
      content,
    });
  };
  const error = (content: any) => {
    messageApi.open({
      type: "error",
      content,
    });
  };

  const info = (content: any) => {
    messageApi.open({
      type: "info",
      content,
    });
  };

  const warn = (content: any) => {
    messageApi.open({
      type: "warning",
      content,
    });
  };

  return { success, error, contextHolder, info, warn };
};

export default useCustomMessage;
