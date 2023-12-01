import { Pie } from '@ant-design/plots';
import { DivPie } from './PieDiv.style';
import { PieChartData } from '../types';
import useStore from '../useStore';

const PieDiv = () => {
  const { data } = useStore();
  const parsedData: PieChartData[] = [];

  data.forEach((user) => {
    const foundIndex = parsedData.findIndex(
      (item) => item.type === user.address.city
    );

    if (foundIndex === -1) {
      parsedData.push({
        type: user.address.city,
        value: 1,
      });
    } else {
      parsedData[foundIndex].value += 1;
    }
  });
  const pieChartData: PieChartData[] = [...parsedData];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    appendPadding: 10,
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        formatter: function formatter() {
          return `total\n134`;
        },
      },
    },
  };
  return (
    <DivPie>
      <Pie {...config} />
    </DivPie>
  );
};

export default PieDiv;
