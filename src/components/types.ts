export type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
};

export type PieChartData = {
  type: string;
  value: number;
};
