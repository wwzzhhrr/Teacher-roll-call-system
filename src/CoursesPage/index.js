import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  Modal,
  Button,
  Input,
  List,
  InputNumber,
  Descriptions,
} from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import useSWR from 'swr';
import axios from 'axios';
import { LeaveIcon as Leave } from '../atoms/index';
import callRoll from '../CallRoll/callRollTab';
import http from '../http';

function AddCourse() {
  const navigate = useNavigate();
  const { Title, Text } = Typography;
  const {
    data: students,
    error,
    isLoading,
    mutate,
  } = useSWR('http://localhost:4000/CoursesList', url =>
    axios.get(url).then(res => res.data),
  );
  const [courses, setCourses] = useState();
  useEffect(() => {
    http.get(`/course`).then(res => setCourses(res.data));
  }, []);

  const [visible, setVisible] = useState(false); //modal是否可见
  const [newName, setNewName] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteName, setDeleteName] = useState();
  const enterCallRoll = paramValue => {
    navigate(`/CourseDetails/${paramValue}`);
  };
  const addCourse = () => {
    console.log(courses);
    setVisible(true);
  };
  const deleteCourse = item => {
    setDeleteModal(true);
    setDeleteName(item);
  };
  const handleOk = () => {
    setVisible(false);
    fetch('http://localhost:4000/CoursesList', {
      method: 'POST', // 请求方法
      body: JSON.stringify({ name: newName }), // 将JavaScript对象转换为JSON字符串
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutate();
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setDeleteModal(false);
    console.log('Cancel button clicked');
  };
  const handleDelete = () => {
    fetch(`http://localhost:4000/CoursesList/${deleteName}`, {
      method: 'DELETE',
    });
    setDeleteModal(false);
    mutate();
  };
  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
    margin: '8px 2px',
  };
  return (
    <div>
      <Leave path={'/Login'} />
      <Title heading={3} style={{ margin: '8px 0' }}>
        请选择您的课程
      </Title>
      <Button onClick={addCourse}>+ 新建课程</Button>
      <Modal
        visible={visible}
        title="新建课程"
        motion={true}
        okText="新建"
        onCancel={handleCancel}
        onOk={handleOk}
        maskClosable={false}
        closeOnEsc={true}
      >
        <Input
          placeholder="课程名称"
          onChange={text => {
            setNewName(text);
          }}
        ></Input>
      </Modal>
      <Modal
        visible={deleteModal}
        title="删除课程"
        motion={true}
        okText="删除课程"
        onCancel={handleCancel}
        onOk={handleDelete}
        maskClosable={false}
        closeOnEsc={true}
      >
        是否删除该课程
      </Modal>
      <List
        grid={{
          gutter: 12,
          xs: 0,
          sm: 0,
          md: 12,
          lg: 8,
          xl: 8,
          xxl: 6,
        }}
        dataSource={courses}
        renderItem={item => (
          <List.Item style={style}>
            <div>
              <h3
                style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}
              >
                {' '}
                {item.name}{' '}
              </h3>
              <Descriptions align="center" size="small" row />
              <Button
                onClick={() => {
                  enterCallRoll(item.id);
                }}
              >
                进入课程
              </Button>
              <IconDelete
                onClick={() => {
                  deleteCourse(item.id);
                }}
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default AddCourse;
