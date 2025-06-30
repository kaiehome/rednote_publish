"use client";
import { Table, Button, message, Tabs, Card, Empty, Input, Select, Tag, Space, Modal, Radio } from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined, SearchOutlined, FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { getContentData, saveContentData, ContentData } from "../utils/dataManager";

interface TaskData {
  key: string;
  taskName: string;
  publishAccount: string;
  taskStatus: string;
  publishTime: string;
  nextExecuteTime: string;
  publishProgress: string;
  createTime: string;
  operation: string;
}

const { Option } = Select;

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ContentData[]>([]);
  const [taskData, setTaskData] = useState<TaskData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [creationType, setCreationType] = useState(1); // 1: 创建新的作品合集, 2: 使用已有作品创建合集
  const [copywritingModalVisible, setCopywritingModalVisible] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [keywords, setKeywords] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ContentData | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // 创作模板相关状态
  const [creationTemplateVisible, setCreationTemplateVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [taskName, setTaskName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [scripts, setScripts] = useState<string[]>([]);
  const [videoCount, setVideoCount] = useState(1);
  const [topics, setTopics] = useState('');
  const [poi, setPoi] = useState('');

  useEffect(() => {
    // 加载内容数据
    const data = getContentData();
    setDataSource(data);
  }, []);

  // 显示文案创作弹窗
  const handleCreateCopywriting = () => {
    setCopywritingModalVisible(true);
  };

  // 确认创建文案
  const handleConfirmCopywriting = () => {
    if (!keywords.trim()) {
      message.error("请输入文案内容");
      return;
    }

    setCopywritingModalVisible(false);
    setLoading(true);

    setTimeout(() => {
      const newContents: ContentData[] = [];
      for (let i = 0; i < generateCount; i++) {
        newContents.push({
          key: `${Date.now()}_${i}`,
          title: `AI文案创作${dataSource.length + i + 1}`,
          status: "草稿",
          created: new Date().toISOString().slice(0, 10)
        });
      }
      const newData = [...dataSource, ...newContents];
      setDataSource(newData);
      saveContentData(newData);
      message.success(`成功创建${generateCount}条文案`);
      setLoading(false);
      
      // 重置表单
      setGenerateCount(1);
      setKeywords('');
    }, 1500);
  };

  // 取消创建文案
  const handleCancelCopywriting = () => {
    setCopywritingModalVisible(false);
    setGenerateCount(1);
    setKeywords('');
  };

  // 编辑文案
  const handleEditCopywriting = (record: ContentData) => {
    setEditingRecord(record);
    setEditTitle(record.title);
    setEditModalVisible(true);
  };

  // 确认编辑文案
  const handleConfirmEdit = () => {
    if (!editTitle.trim()) {
      message.error("请输入文案标题");
      return;
    }

    if (editingRecord) {
      const newData = dataSource.map(item => 
        item.key === editingRecord.key 
          ? { ...item, title: editTitle.trim() }
          : item
      );
      setDataSource(newData);
      saveContentData(newData);
      message.success("文案编辑成功");
    }

    setEditModalVisible(false);
    setEditingRecord(null);
    setEditTitle('');
  };

  // 取消编辑文案
  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingRecord(null);
    setEditTitle('');
  };

  // 发布文案
  const handlePublishCopywriting = (record: ContentData) => {
    if (record.status === "已发布") {
      message.warning("该文案已经发布");
      return;
    }
    
    const newData = dataSource.map(item => 
      item.key === record.key 
        ? { ...item, status: "已发布" }
        : item
    );
    setDataSource(newData);
    saveContentData(newData);
    message.success(`文案"${record.title}"发布成功`);
  };

  // 删除文案
  const handleDeleteCopywriting = (record: ContentData) => {
    if (window.confirm(`确定要删除文案"${record.title}"吗？`)) {
      const newData = dataSource.filter(item => item.key !== record.key);
      setDataSource(newData);
      saveContentData(newData);
      message.success('删除成功');
    }
  };

  // 显示创建合集弹窗
  const handleCreateMatrixTask = () => {
    setModalVisible(true);
  };

  // 确认创建矩阵任务
  const handleConfirmCreate = () => {
    setModalVisible(false);
    
    if (creationType === 1) {
      // 创建新的作品合集 - 打开创作模板页面
      setCreationTemplateVisible(true);
      setCurrentStep(1);
      // 重置所有状态
      setTaskName('');
      setSelectedAvatar('');
      setSelectedVoice('');
      setTitles([]);
      setSubtitles([]);
      setScripts([]);
      setVideoCount(1);
      setTopics('');
      setPoi('');
    } else {
      // 使用已有作品创建合集
      setLoading(true);
      setTimeout(() => {
        const newTask: TaskData = {
          key: Date.now().toString(),
          taskName: `已有作品合集${taskData.length + 1}`,
          publishAccount: "账号A",
          taskStatus: "待发布",
          publishTime: "每日10:00",
          nextExecuteTime: "2025-06-28 10:00",
          publishProgress: "0/1",
          createTime: new Date().toISOString().slice(0, 10),
          operation: "编辑"
        };
        setTaskData([...taskData, newTask]);
        message.success("已有作品合集创建成功");
        setLoading(false);
      }, 1000);
    }
    setCreationType(1); // 重置为默认选项
  };

  // 取消创建
  const handleCancelCreate = () => {
    setModalVisible(false);
    setCreationType(1); // 重置为默认选项
  };

  // 新增发布任务
  const handleCreatePublishTask = () => {
    message.info("新增发布任务功能开发中...");
  };

  // 模拟发布
  const handleSimulatePublish = () => {
    message.success("模拟发布成功");
  };

  // 创作模板相关函数
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseCreationTemplate = () => {
    setCreationTemplateVisible(false);
    setCurrentStep(1);
  };

  const handleSelectAvatar = (type: 'library' | 'upload') => {
    if (type === 'library') {
      message.info("从素材库选择形象功能开发中...");
      setSelectedAvatar("library_avatar_1");
    } else {
      message.info("从本地上传形象功能开发中...");
      setSelectedAvatar("upload_avatar_1");
    }
  };

  const handleSelectVoice = () => {
    message.info("从素材库选择音色功能开发中...");
    setSelectedVoice("voice_1");
  };

  const handleGenerateContent = (type: 'title' | 'subtitle' | 'script') => {
    const contents = [
      "AI生成的精彩内容1",
      "AI生成的精彩内容2", 
      "AI生成的精彩内容3"
    ];
    
    if (type === 'title') {
      setTitles([...titles, ...contents]);
      message.success("AI标题生成成功");
    } else if (type === 'subtitle') {
      setSubtitles([...subtitles, ...contents]);
      message.success("AI副标题生成成功");
    } else {
      setScripts([...scripts, ...contents]);
      message.success("AI口播文案生成成功");
    }
  };

  const handleManualAdd = (type: 'title' | 'subtitle' | 'script', content: string) => {
    if (!content.trim()) {
      message.error("请输入内容");
      return;
    }
    
    if (type === 'title') {
      setTitles([...titles, content]);
    } else if (type === 'subtitle') {
      setSubtitles([...subtitles, content]);
    } else {
      setScripts([...scripts, content]);
    }
    message.success("添加成功");
  };

  const handleSaveTemplate = () => {
    if (!taskName.trim()) {
      message.error("请输入任务名称");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newTask: TaskData = {
        key: Date.now().toString(),
        taskName: taskName,
        publishAccount: "数字人账号",
        taskStatus: "待发布",
        publishTime: "每日10:00",
        nextExecuteTime: "2025-06-28 10:00",
        publishProgress: `0/${videoCount}`,
        createTime: new Date().toISOString().slice(0, 10),
        operation: "编辑"
      };
      setTaskData([...taskData, newTask]);
      message.success("数字人矩阵发布任务创建成功");
      setLoading(false);
      setCreationTemplateVisible(false);
      setCurrentStep(1);
    }, 1000);
  };

  const handleSaveDraft = () => {
    message.success("草稿保存成功");
  };

  // 文案创作列数据
  const copywritingColumns = [
    { title: "文案标题", dataIndex: "title", key: "title" },
    { 
      title: "状态", 
      dataIndex: "status", 
      key: "status",
      render: (status: string) => (
        <Tag color={status === "已发布" ? "green" : "orange"}>{status}</Tag>
      )
    },
    { title: "创建时间", dataIndex: "created", key: "created" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: ContentData) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEditCopywriting(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => handlePublishCopywriting(record)}
            disabled={record.status === "已发布"}
          >
            发布
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            onClick={() => handleDeleteCopywriting(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 矩阵任务列数据
  const matrixTaskColumns = [
    { title: "任务名称", dataIndex: "taskName", key: "taskName" },
    { title: "发布账号", dataIndex: "publishAccount", key: "publishAccount" },
    { 
      title: "任务状态", 
      dataIndex: "taskStatus", 
      key: "taskStatus",
      render: (status: string) => (
        <Tag color={status === "运行中" ? "green" : status === "待发布" ? "orange" : "red"}>
          {status}
        </Tag>
      )
    },
    { title: "发布周期", dataIndex: "publishTime", key: "publishTime" },
    { title: "下次执行时间", dataIndex: "nextExecuteTime", key: "nextExecuteTime" },
    { title: "发布进度", dataIndex: "publishProgress", key: "publishProgress" },
    { title: "创建时间", dataIndex: "createTime", key: "createTime" },
    {
      title: "操作",
      key: "operation",
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">启动</Button>
          <Button type="link" size="small">暂停</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      )
    }
  ];

  // Tabs 配置项
  const tabItems = [
    {
      key: "1",
      label: "文案生成",
      children: (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: 22, margin: 0 }}>文案创作</h2>
              <p style={{ color: "#666", margin: "8px 0 0 0" }}>
                请先完成文案的创建，随后即可设置任务并自动进行发布者任务。
              </p>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateCopywriting}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              {loading ? "创建中..." : "创建文案列表"}
            </Button>
          </div>

          {dataSource.length > 0 ? (
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Input 
                    placeholder="搜索文案标题"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Select placeholder="状态筛选" allowClear style={{ width: 120 }}>
                    <Option value="草稿">草稿</Option>
                    <Option value="已发布">已发布</Option>
                  </Select>
                </Space>
              </div>
              <Table 
                dataSource={dataSource.filter(item => 
                  item.title.toLowerCase().includes(searchText.toLowerCase())
                )} 
                columns={copywritingColumns} 
                pagination={{ pageSize: 10 }}
              />
            </Card>
          ) : (
            <Card style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty 
                description="暂无更多了"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>
      )
    },
    {
      key: "2",
      label: "内容创作",
      children: (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: 22, margin: 0 }}>内容创作</h2>
              <p style={{ color: "#666", margin: "8px 0 0 0" }}>
                您可在编辑创作完成后自启矩阵发布任务。
              </p>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateMatrixTask}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              {loading ? "创建中..." : "新建创作任务"}
            </Button>
          </div>

          <Card style={{ textAlign: "center", padding: "60px 0" }}>
            <Empty 
              description="暂无数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        </div>
      )
    },
    {
      key: "3",
      label: "矩阵任务",
      children: (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePublishTask}>
                新增发布任务
              </Button>
              <Button onClick={handleSimulatePublish}>
                模拟发布
              </Button>
            </Space>
            <Space>
              <Button>全部</Button>
              <Button>运行中</Button>
              <Button>未开启</Button>
              <Input 
                placeholder="输入任务名称"
                suffix={<SearchOutlined />}
                style={{ width: 150 }}
              />
              <Button icon={<FilterOutlined />}>筛选</Button>
            </Space>
          </div>

          {taskData.length > 0 ? (
            <Card>
              <Table 
                dataSource={taskData} 
                columns={matrixTaskColumns} 
                pagination={{ pageSize: 10 }}
              />
            </Card>
          ) : (
            <Card style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty 
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        {/* 创作合集选择弹窗 */}
        <Modal
          title="选择本次创作合集"
          open={modalVisible}
          onOk={handleConfirmCreate}
          onCancel={handleCancelCreate}
          okText="确定"
          cancelText="取消"
          width={600}
          closeIcon={<CloseOutlined />}
        >
          <div style={{ padding: "20px 0" }}>
            <Radio.Group 
              value={creationType} 
              onChange={(e) => setCreationType(e.target.value)}
              style={{ width: "100%" }}
            >
              <div style={{ marginBottom: 24 }}>
                <Radio value={1} style={{ marginBottom: 8 }}>
                  <strong>创建新的作品合集</strong>
                </Radio>
                <div style={{ 
                  marginLeft: 24, 
                  color: "#666", 
                  lineHeight: "1.6",
                  fontSize: 14 
                }}>
                  选择你的形象、音色、口播文案等，将一次性为你批量生成专属内容的数字人口播视频，白动发布任务将在创作完成后启动发布。
                </div>
              </div>
              
              <div>
                <Radio value={2}>
                  <strong>使用已有作品创建合集</strong>
                </Radio>
                <div style={{ 
                  marginLeft: 24, 
                  color: "#666", 
                  lineHeight: "1.6",
                  fontSize: 14,
                  marginTop: 8 
                }}>
                  选择好您已有的作品，创建合集后即可上传至任务自动发布。
                </div>
              </div>
            </Radio.Group>
          </div>
        </Modal>

        {/* 文案创建弹窗 */}
        <Modal
          title="创建文案"
          open={copywritingModalVisible}
          onOk={handleConfirmCopywriting}
          onCancel={handleCancelCopywriting}
          okText="确定"
          cancelText="取消"
          width={500}
        >
          <div style={{ padding: "20px 0" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                marginBottom: 8, 
                color: "#ff4d4f", 
                fontSize: 14,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: 4 }}>*</span>
                <span>生成数量</span>
              </div>
              <Input
                type="number"
                min={1}
                max={10}
                value={generateCount}
                onChange={(e) => setGenerateCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                style={{ width: "100%" }}
                placeholder="请输入生成数量"
              />
            </div>

            <div>
              <div style={{ 
                marginBottom: 8, 
                color: "#ff4d4f", 
                fontSize: 14,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: 4 }}>*</span>
                <span>文案内容</span>
              </div>
              <Input.TextArea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="请输入文案内容..."
                showCount
                maxLength={500}
                rows={8}
                style={{ 
                  resize: 'none',
                  fontSize: 14
                }}
              />
            </div>
          </div>
        </Modal>

        {/* 编辑文案弹窗 */}
        <Modal
          title="编辑文案"
          open={editModalVisible}
          onOk={handleConfirmEdit}
          onCancel={handleCancelEdit}
          okText="确定"
          cancelText="取消"
          width={500}
        >
          <div style={{ padding: "20px 0" }}>
            <div>
              <div style={{ 
                marginBottom: 8, 
                color: "#ff4d4f", 
                fontSize: 14,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: 4 }}>*</span>
                <span>文案标题</span>
              </div>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="请输入文案标题..."
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Modal>

        {/* 创作模板弹窗 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>数字人矩阵发布小红书 / 新增矩阵任务</span>
              <Button type="text" onClick={handleCloseCreationTemplate}>
                <CloseOutlined />
              </Button>
            </div>
          }
          open={creationTemplateVisible}
          footer={null}
          width={800}
          closable={false}
          destroyOnClose
        >
          <div style={{ padding: "20px 0" }}>
            {/* 步骤1: 任务名称和形象设置 */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>新增创作模板</h3>
                <p style={{ color: "#666", marginBottom: 24 }}>
                  模板中的内容已自动代入上一步中创建的内容。
                </p>
                
                <div style={{ 
                  background: "#fff7e6", 
                  border: "1px solid #ffd591", 
                  borderRadius: 6, 
                  padding: "12px 16px", 
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#fa8c16", marginRight: 8 }}>⚠</span>
                  <span style={{ color: "#fa8c16" }}>
                    注意：请慎选择要生成的数量，避免造成扣除大量费用！
                  </span>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>任务名称</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                  </div>
                  <Input
                    placeholder="请输入任务名称"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    showCount
                    maxLength={50}
                    style={{ marginBottom: 8 }}
                  />
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>形象设置</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                    <span style={{ marginLeft: 16, color: "#666" }}>形象数量 (0/30)</span>
                  </div>
                  
                  <Space>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>📁</span>}
                      onClick={() => handleSelectAvatar('library')}
                    >
                      从素材库中选择
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>📤</span>}
                      onClick={() => handleSelectAvatar('upload')}
                    >
                      从本地上传
                    </Button>
                  </Space>

                  {selectedAvatar && (
                    <div style={{ 
                      marginTop: 16, 
                      padding: 16, 
                      background: "#f5f5f5", 
                      borderRadius: 6,
                      textAlign: "center"
                    }}>
                      <div style={{ 
                        width: 100, 
                        height: 100, 
                        background: "#d9d9d9", 
                        borderRadius: 6, 
                        margin: "0 auto 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        👤
                      </div>
                      <span style={{ color: "#666" }}>暂无形象</span>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={handleNextStep} disabled={!taskName.trim()}>
                    下一步
                  </Button>
                </div>
              </div>
            )}

            {/* 步骤2: 音色选择 */}
            {currentStep === 2 && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>音色选择</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                    <span style={{ marginLeft: 16, color: "#666" }}>音色数量 (0/30)</span>
                  </div>
                  
                  <Button 
                    type="primary" 
                    danger 
                    icon={<span>📁</span>}
                    onClick={handleSelectVoice}
                  >
                    从素材库中选择
                  </Button>

                  {selectedVoice && (
                    <div style={{ 
                      marginTop: 16, 
                      padding: 16, 
                      background: "#f5f5f5", 
                      borderRadius: 6,
                      textAlign: "center"
                    }}>
                      <div style={{ 
                        width: 100, 
                        height: 100, 
                        background: "#d9d9d9", 
                        borderRadius: 6, 
                        margin: "0 auto 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        🎵
                      </div>
                      <span style={{ color: "#666" }}>暂无音色内容</span>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <Space>
                    <Button onClick={handlePrevStep}>上一步</Button>
                    <Button type="primary" onClick={handleNextStep} disabled={!selectedVoice}>
                      下一步
                    </Button>
                  </Space>
                </div>
              </div>
            )}

            {/* 步骤3: 标题设置 */}
            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>标题</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                    <span style={{ marginLeft: 16, color: "#666" }}>标题数量 (0/30)</span>
                  </div>
                  
                  <Space style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✨</span>}
                      onClick={() => handleGenerateContent('title')}
                    >
                      AI快速生成
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✋</span>}
                      onClick={() => {
                        const content = prompt("请输入标题内容：");
                        if (content) handleManualAdd('title', content);
                      }}
                    >
                      手动添加
                    </Button>
                  </Space>

                  {titles.length > 0 && (
                    <div style={{ 
                      background: "#f5f5f5", 
                      borderRadius: 6, 
                      padding: 16, 
                      marginBottom: 16 
                    }}>
                      <h4>已添加的标题：</h4>
                      {titles.map((title, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                          {index + 1}. {title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <Space>
                    <Button onClick={handleSaveDraft}>保存草稿</Button>
                    <Button onClick={handlePrevStep}>上一步</Button>
                    <Button type="primary" onClick={handleNextStep} disabled={titles.length === 0}>
                      下一步
                    </Button>
                  </Space>
                </div>
              </div>
            )}

            {/* 步骤4: 副标题设置 */}
            {currentStep === 4 && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>副标题</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                    <span style={{ marginLeft: 16, color: "#666" }}>副标题数量 (0/30)</span>
                  </div>
                  
                  <Space style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✨</span>}
                      onClick={() => handleGenerateContent('subtitle')}
                    >
                      AI快速生成
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✋</span>}
                      onClick={() => {
                        const content = prompt("请输入副标题内容：");
                        if (content) handleManualAdd('subtitle', content);
                      }}
                    >
                      手动添加
                    </Button>
                  </Space>

                  {subtitles.length > 0 ? (
                    <div style={{ 
                      background: "#f5f5f5", 
                      borderRadius: 6, 
                      padding: 16, 
                      marginBottom: 16 
                    }}>
                      <h4>已添加的副标题：</h4>
                      {subtitles.map((subtitle, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                          {index + 1}. {subtitle}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      background: "#f5f5f5", 
                      borderRadius: 6, 
                      padding: 40, 
                      textAlign: "center",
                      marginBottom: 16 
                    }}>
                      <div style={{ 
                        width: 60, 
                        height: 60, 
                        background: "#d9d9d9", 
                        borderRadius: "50%", 
                        margin: "0 auto 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        📝
                      </div>
                      <span style={{ color: "#666" }}>暂无副标题内容</span>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <Space>
                    <Button onClick={handlePrevStep}>上一步</Button>
                    <Button type="primary" onClick={handleNextStep}>
                      下一步
                    </Button>
                  </Space>
                </div>
              </div>
            )}

            {/* 步骤5: 口播文案和发布设置 */}
            {currentStep === 5 && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#ff4d4f", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>口播文案</span>
                    <Tag color="orange" style={{ marginLeft: 12 }}>配置未完成</Tag>
                    <span style={{ marginLeft: 16, color: "#666" }}>口播数量 (0/30)</span>
                  </div>
                  
                  <Space style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✨</span>}
                      onClick={() => handleGenerateContent('script')}
                    >
                      AI快速生成
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✋</span>}
                      onClick={() => {
                        const content = prompt("请输入口播文案内容：");
                        if (content) handleManualAdd('script', content);
                      }}
                    >
                      手动添加
                    </Button>
                  </Space>

                  {scripts.length > 0 && (
                    <div style={{ 
                      background: "#f5f5f5", 
                      borderRadius: 6, 
                      padding: 16, 
                      marginBottom: 24 
                    }}>
                      <h4>已添加的口播文案：</h4>
                      {scripts.map((script, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                          {index + 1}. {script}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      background: "#52c41a", 
                      borderRadius: "50%", 
                      marginRight: 8 
                    }}></div>
                    <span style={{ fontWeight: 600 }}>发布设置</span>
                    <Tag color="green" style={{ marginLeft: 12 }}>配置完成</Tag>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8, color: "#ff4d4f" }}>* 视频生成数量</div>
                    <p style={{ color: "#666", fontSize: 12, marginBottom: 8 }}>
                      请您输入一个标题，视频生成将按照顺序自动按照目前生成名
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={videoCount}
                        onChange={(e) => setVideoCount(parseInt(e.target.value) || 1)}
                        style={{ width: 200, marginRight: 8 }}
                      />
                      <span>条</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>话题设置</div>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<span>✋</span>}
                      onClick={() => {
                        const topic = prompt("请输入话题：");
                        if (topic) setTopics(topic);
                      }}
                    >
                      手动添加
                    </Button>
                    {topics && (
                      <div style={{ marginTop: 8, color: "#666" }}>
                        已设置话题：{topics}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>POI未知设置</div>
                    <p style={{ color: "#666", fontSize: 12, marginBottom: 8 }}>
                      请保证位置输入准确性，这将影响到您在自动发布时所覆盖的信息
                    </p>
                    <Input
                      placeholder="请确保位置输入准确性"
                      value={poi}
                      onChange={(e) => setPoi(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <Space>
                    <Button type="primary" onClick={handleSaveTemplate} loading={loading}>
                      保存
                    </Button>
                    <Button onClick={handleSaveDraft}>保存草稿箱</Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  } 