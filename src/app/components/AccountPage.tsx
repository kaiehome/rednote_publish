"use client";
import { useState, useRef, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm, Tag, message, Space } from "antd";
import { getAccountData, saveAccountData, AccountData } from "../utils/dataManager";

const initialData: AccountData[] = [
  { key: "1", name: "账号A", status: "正常", created: "2024-06-25" },
  { key: "2", name: "账号B", status: "禁用", created: "2024-06-20" },
  { key: "3", name: "账号C", status: "正常", created: "2024-06-18" },
  { key: "4", name: "账号D", status: "正常", created: "2024-06-15" },
];

const statusOptions = [
  { label: "正常", value: "正常" },
  { label: "禁用", value: "禁用" },
];

export default function AccountPage() {
  // 从数据管理器加载数据，如果没有则使用初始数据
  const [data, setData] = useState<AccountData[]>(() => {
    const savedData = getAccountData();
    return savedData.length > 0 ? savedData : initialData;
  });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AccountData | null>(null);
  const [form] = Form.useForm();
  const [loadingKey, setLoadingKey] = useState("");
  const [highlightKey, setHighlightKey] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const tableRef = useRef<any>(null);

  // 保存数据到数据管理器
  const saveDataToStorage = (newData: AccountData[]) => {
    saveAccountData(newData);
  };

  // 重置数据到初始状态
  const handleResetData = () => {
    setData(initialData);
    saveDataToStorage(initialData);
    setSelectedRowKeys([]);
    message.success("数据已重置到初始状态");
  };

  // 搜索过滤
  const filteredData = data.filter((item) =>
    item.name.includes(search)
  );

  // 新增/编辑弹窗
  const openModal = (record: AccountData | null = null) => {
    setEditing(record);
    setModalOpen(true);
    setTimeout(() => {
      form.getFieldInstance && form.getFieldInstance("name")?.focus?.();
    }, 200);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.setFieldsValue({ name: '', status: statusOptions[0].value });
    }
  };

  // 账号名唯一性校验
  const validateUniqueName = (_: any, value: any) => {
    if (!value) return Promise.resolve();
    const exists = data.some(
      (item) => item.name === value && (!editing || item.key !== editing.key)
    );
    return exists
      ? Promise.reject(new Error("账号名称已存在"))
      : Promise.resolve();
  };

  // 保存账号
  const handleSave = () => {
    form.validateFields().then((values) => {
      // 模拟接口失败场景
      if (values.name === "fail") {
        message.error("保存失败：模拟接口错误");
        return;
      }
      
      let newData: AccountData[];
      if (editing) {
        newData = data.map((item) =>
          item.key === editing.key ? { ...item, ...values } : item
        );
        setData(newData);
        saveDataToStorage(newData);
        setHighlightKey(editing.key);
        message.success("账号已更新");
      } else {
        const newKey = Date.now().toString();
        newData = [
          ...data,
          { ...values, key: newKey, created: new Date().toISOString().slice(0, 10) },
        ];
        setData(newData);
        saveDataToStorage(newData);
        setHighlightKey(newKey);
        message.success("账号已添加");
      }
      
      // 立即关闭弹窗
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  // 删除账号
  const handleDelete = (key: string) => {
    setLoadingKey(key);
    setTimeout(() => {
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      saveDataToStorage(newData);
      message.success("账号已删除");
      setLoadingKey("");
    }, 600);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setLoadingKey("batch-delete");
    setTimeout(() => {
      const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
      setData(newData);
      saveDataToStorage(newData);
      setSelectedRowKeys([]);
      message.success("批量删除成功");
      setLoadingKey("");
    }, 800);
  };

  // 状态切换
  const handleStatusChange = (key: string, status: string) => {
    setLoadingKey(key + "-status");
    setTimeout(() => {
      const newData = data.map((item) =>
        item.key === key ? { ...item, status } : item
      );
      setData(newData);
      saveDataToStorage(newData);
      message.success("状态已更新");
      setLoadingKey("");
    }, 600);
  };

  // 自动滚动到高亮行
  useEffect(() => {
    if (highlightKey && tableRef.current) {
      const row = document.querySelector(`tr[data-row-key='${highlightKey}']`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightKey(""), 1200);
    }
  }, [highlightKey]);

  const columns = [
    {
      title: "账号名称",
      dataIndex: "name",
      key: "name",
      sorter: (a: AccountData, b: AccountData) => a.name.localeCompare(b.name),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <Tag color={text === "正常" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created",
      key: "created",
      sorter: (a: AccountData, b: AccountData) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: AccountData) => (
        <Space split={<span>|</span>}>
          <Popconfirm
            title="确定要删除该账号吗？"
            onConfirm={() => handleDelete(record.key)}
            okButtonProps={{ 
              disabled: loadingKey === record.key,
              style: {
                width: '60px',
                opacity: loadingKey === record.key ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }
            }}
            okText={loadingKey === record.key ? "删除中..." : "确定"}
            cancelText="取消"
          >
            <Button 
              size="small" 
              danger 
              disabled={loadingKey === record.key}
              style={{ 
                width: '48px', 
                opacity: loadingKey === record.key ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              {loadingKey === record.key ? '...' : '删除'}
            </Button>
          </Popconfirm>
          <Select
            size="small"
            value={record.status}
            style={{ 
              width: 80,
              opacity: loadingKey === record.key + "-status" ? 0.6 : 1,
              transition: 'opacity 0.3s'
            }}
            onChange={(val) => handleStatusChange(record.key, val)}
            options={statusOptions}
            disabled={loadingKey === record.key + "-status"}
            placeholder={loadingKey === record.key + "-status" ? "更新中..." : undefined}
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontWeight: 600, fontSize: 22 }}>账号管理</h2>
        <div>
          <Input.Search
            placeholder="搜索账号"
            allowClear
            style={{ width: 200, marginRight: 12 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button type="primary" onClick={() => openModal()}>添加账号</Button>
          <Popconfirm
            title={`确定要删除选中的${selectedRowKeys.length}个账号吗？`}
            onConfirm={handleBatchDelete}
            okButtonProps={{ 
              disabled: loadingKey === "batch-delete",
              style: {
                width: '80px',
                opacity: loadingKey === "batch-delete" ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }
            }}
            disabled={selectedRowKeys.length === 0}
            okText={loadingKey === "batch-delete" ? "删除中..." : "确定"}
            cancelText="取消"
          >
            <Button
              danger
              style={{ 
                marginLeft: 8,
                width: '80px',
                opacity: loadingKey === "batch-delete" ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
              disabled={selectedRowKeys.length === 0 || loadingKey === "batch-delete"}
            >
              {loadingKey === "batch-delete" ? '删除中...' : '批量删除'}
            </Button>
          </Popconfirm>
          <Button
            style={{ marginLeft: 8 }}
            onClick={handleResetData}
          >
            重置数据
          </Button>
        </div>
      </div>
      <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
        💡 提示：双击表格行可以编辑账号信息
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        ref={tableRef}
        rowClassName={record => record.key === highlightKey ? "highlight-row" : ""}
        onRow={record => ({
          onMouseEnter: e => e.currentTarget.style.background = "#f5faff",
          onMouseLeave: e => e.currentTarget.style.background = record.key === highlightKey ? "#e6f7ff" : "",
          onDoubleClick: () => openModal(record),
          style: { cursor: 'pointer' }
        })}
        rowSelection={rowSelection}
      />
      <Modal
        title={editing ? "编辑账号" : "添加账号"}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleSave}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="账号名称"
            rules={[
              { required: true, message: "请输入账号名称" },
              { validator: validateUniqueName },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
      <style jsx global>{`
        .highlight-row {
          background: #e6f7ff !important;
          transition: background 0.5s;
        }
        
        /* 优化按钮加载状态 */
        .ant-btn:disabled {
          cursor: not-allowed;
        }
        
        /* 优化下拉框加载状态 */
        .ant-select-disabled .ant-select-selector {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 