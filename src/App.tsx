import PieDiv from './components/pieDiv/PieDiv';
import TableDiv from './components/tableDiv/TableDiv';
import { Flex } from 'antd';

const App = () => {
  return (
    <Flex>
      <TableDiv />
      <PieDiv />
    </Flex>
  );
};

export default App;
