export type ErrorMsgProp<T> = {
  name: keyof T;
  errorStatus: boolean;
  message: string | null;
};

export type Fields<T> = { 
  key: keyof T;
  message: string;
};
