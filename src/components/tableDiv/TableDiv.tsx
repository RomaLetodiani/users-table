import { Table, Modal, Button, Flex, Form, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import useStore from '../useStore';
import { User } from '../types';
import { DivTable } from './TableDiv.style';

const TableDiv = () => {
  const { data, fetchData, deleteUser, addUser, updateUserInfo } = useStore(
    (state) => state
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState<User>({} as User);
  const [modalStatus, setModalStatus] = useState<'add' | 'edit'>('add');
  const [form] = Form.useForm();

  const closeModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleEdit = (record: User) => {
    setActiveRecord(record);
    setModalStatus('edit');
    setIsModalVisible(true);
  };
  const handleOnClickEdit = (user: User, updatedInfo: Partial<User>) => {
    updateUserInfo(user.id, updatedInfo);
    closeModal();
  };

  const handleSingularDelete = (record: User) => {
    deleteUser(record.id);
  };

  const handleSelectedDelete = () => {
    if (selectedRowKeys.length < 1) {
      return;
    }
    selectedRowKeys.forEach((key) => {
      deleteUser(Number(key));
    });
    setSelectedRowKeys([]);
  };

  const handleAdd = () => {
    setActiveRecord({
      id: Math.floor(Math.random() * 10000),
      name: '',
      email: '',
      gender: '',
      address: {
        street: '',
        city: '',
      },
      phone: '',
    } as User);
    setModalStatus('add');
    setIsModalVisible(true);
  };

  const handleOnClickAdd = (user: User) => {
    addUser(user);
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Address',
      dataIndex: ['address', 'street'],
      key: 'address',
      render: (_text: string, record: User) =>
        `${record.address.street}, ${record.address.city}`,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '',
      key: 'edit',
      render: (_: string, record: User) => (
        <a onClick={() => handleEdit(record)}>Edit</a>
      ),
    },
    {
      title: '',
      key: 'delete',
      render: (_: string, record: User) => (
        <a onClick={() => handleSingularDelete(record)}>Delete</a>
      ),
    },
  ];

  const onSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys as string[]);
  };

  const handleOnChange = (fields: string[], value: string) => {
    setActiveRecord((prev) => {
      const updatedRecord = { ...prev };

      // Get a reference to the nested object to update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let nestedObject: { [key: string]: any } = updatedRecord;
      for (let i = 0; i < fields.length - 1; i++) {
        nestedObject = nestedObject[fields[i]];
      }

      // Update the nested field
      nestedObject[fields[fields.length - 1]] = value || '';
      return updatedRecord as User;
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Filter `option.label` match the user type `input`
  const filterOptionGender = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <DivTable>
      <Flex gap="10px">
        <Button type="primary" onClick={handleAdd}>
          ADD
        </Button>
        <Button type="primary" danger onClick={handleSelectedDelete}>
          Delete
        </Button>
      </Flex>
      <Table
        dataSource={data}
        rowKey={'id'}
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        onRow={(record: User) => {
          return {
            onDoubleClick: () => {
              setActiveRecord(record);
              setIsModalVisible(true);
            },
          };
        }}
      />
      <Modal
        title={`${modalStatus === 'add' ? 'Add' : 'Edit'} User info`}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please enter a name',
              },
            ]}
          >
            <Input
              value={modalStatus === 'edit' ? activeRecord.name : ''}
              onChange={(e) => handleOnChange(['name'], e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid Email',
              },
            ]}
          >
            <Input
              value={modalStatus === 'edit' ? activeRecord.email : ''}
              onChange={(e) => handleOnChange(['email'], e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: 'Please choose a Gender',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(value) => handleOnChange(['gender'], value)}
              filterOption={filterOptionGender}
              options={[
                {
                  value: 'Female',
                  label: 'Female',
                },
                {
                  value: 'Male',
                  label: 'Male',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="street"
            label="Street"
            rules={[
              {
                required: true,
                message: 'Please enter a street',
              },
            ]}
          >
            <Input
              value={modalStatus === 'edit' ? activeRecord.address.street : ''}
              onChange={(e) =>
                handleOnChange(['address', 'street'], e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[
              {
                required: true,
                message: 'Please enter a City',
              },
            ]}
          >
            <Input
              value={modalStatus === 'edit' ? activeRecord.address.city : ''}
              onChange={(e) =>
                handleOnChange(['address', 'city'], e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: 'Please enter a Phone',
              },
            ]}
          >
            <Input
              value={modalStatus === 'edit' ? activeRecord.phone : ''}
              onChange={(e) => handleOnChange(['phone'], e.target.value)}
            />
          </Form.Item>
          <Button
            onClick={() =>
              modalStatus === 'add'
                ? handleOnClickAdd(activeRecord)
                : handleOnClickEdit(activeRecord, activeRecord)
            }
          >
            {modalStatus === 'add' ? 'Add' : 'Edit'}
          </Button>
        </Form>
      </Modal>
    </DivTable>
  );
};

export default TableDiv;
