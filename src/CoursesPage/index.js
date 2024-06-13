import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Modal,
  Button,
  Input,
  List,
  Descriptions,
} from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { LeaveIcon as Leave } from '../atoms/index';
import http from '../http';

function AddCourse() {
  const navigate = useNavigate();
  const { Title, Text } = Typography;
  const [courses, setCourses] = useState();
  useEffect(() => {
    http.get(`/course`).then(res => setCourses(res.data));
  }, []);

  const [visible, setVisible] = useState(false); //modal是否可见
  const [newName, setNewName] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const enterCourse = paramValue => {
    http
      .post(`/class/${paramValue}`, { timestamp: Date.now() })
      .then(res => navigate(`/CourseDetails/${paramValue}/${res.data.id}`));
  };
  const addCourse = () => {
    setVisible(true);
  };
  const deleteCourse = item => {
    setDeleteModal(true);
    setDeleteId(item);
  };
  const handleOk = () => {
    setVisible(false);
    http
      .post('/course/addCourse', { name: newName })
      .then(() => location.reload());
  };
  const handleCancel = () => {
    setVisible(false);
    setDeleteModal(false);
    console.log('Cancel button clicked');
  };
  const handleDelete = () => {
    console.log(deleteId);
    http.delete(`/course/${deleteId}`).then(res => setDeleteModal(false));
    location.reload();
  };
  return (
    <div>
      <Leave path={'/Login'} />
      <div className={styles.topTab}>
        <Title heading={3} style={{ margin: '8px 0' }}>
          请选择您的课程
        </Title>
        <Button className={styles.add} onClick={addCourse}>
          + 新建课程
        </Button>
      </div>
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
          <List.Item
            className={styles.courseList}
            style={{ paddingLeft: '20px', paddingBottom: '10px' }}
          >
            <div>
              <h3
                style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}
              >
                {' '}
                {item.name}{' '}
              </h3>
              <Descriptions align="center" size="small" row />
              <div className={styles.enterTab}>
                <Button
                  onClick={() => {
                    enterCourse(item.id);
                  }}
                  className={styles.enter}
                >
                  进入课程
                </Button>
                <IconDelete
                  className={styles.delete}
                  onClick={() => {
                    deleteCourse(item.id);
                  }}
                />
              </div>
            </div>
          </List.Item>
        )}
      />
      <img className={styles.logo} src="/backGroundLogo.png" alt="logo" />
    </div>
  );
}

export default AddCourse;
