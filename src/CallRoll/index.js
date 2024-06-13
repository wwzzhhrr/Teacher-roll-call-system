import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  List,
  Modal,
  Radio,
  RadioGroup,
  TabPane,
  Tabs,
  Typography,
} from '@douyinfe/semi-ui';
import { IconEdit, IconFile } from '@douyinfe/semi-icons';
import styles from './index.module.css';
import { CallRollTab } from './callRollTab';
import { MakeGroupTab } from './makeGroupTab';
import { LeaveIcon as Leave } from '../atoms/index';

import http from '../http';

function App() {
  function transformData(data) {
    return data.map((item, index) => {
      const sessionText = session[item.session];
      const statusText = status[item.status];
      const updateTime =
        new Date(item.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) + ` ${sessionText}`;
      return {
        key: index,
        updateTime: updateTime,
        student: item.name,
        state: statusText,
      };
    });
  }
  const status = {
    1: '迟到',
    2: '请假',
    3: '缺勤',
  };
  const session = {
    0: '上午',
    1: '下午',
  };
  const [changePointsButton, setChangePointsButton] = useState(false); //控制是否修改数据
  const [changeAttendance, setChangeAttendance] = useState(false);
  const [value, setValue] = useState([]);

  const { Title } = Typography;
  const { courseId: course, classId: classId } = useParams();
  const handleChangeAttendance = () => {
    setChangeAttendance(false);
  };
  const [courseName, setCourseName] = useState();
  async function handleOk() {
    setChangeAttendance(false);
    await Promise.all(
      value.map(async i => {
        console.log(i);
        return http.post(
          `/attendance/courses/${i[1]}/classes/${i[2]}/students/${i[3]}`,
          {
            status: i[0],
          },
        );
      }),
    );
  }
  const [studentBackEnd, setStudentBackEnd] = useState();
  const [score, setScore] = useState();
  async function getStudent(course) {
    try {
      const response = await http.get(`student/studentCourse/${course}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student course:', error);
      throw error;
    }
  }
  async function getScore(course, classId) {
    try {
      const response = await http.get(
        `/score/courses/${course}/classes/${classId}`,
      );
      return response.data.reduce((acc, curr) => {
        acc[curr.student_id] = curr.score;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  }
  async function fetchData() {
    const [studentData, scoreData] = await Promise.all([
      getStudent(course),
      getScore(course, classId),
    ]);

    setScore(scoreData);
    setStudentBackEnd(studentData);
    return [scoreData, studentData];
  }
  useEffect(() => {
    fetchData().then(data => {
      setScore(data[0]);
      setStudentBackEnd(data[1]);
    });
  }, []);
  const changeState = (e, id) => {
    // console.log(name, e);
    console.log(id, e.target.value ? e.target.value : 0, course, classId, id);
    let a = value;
    a.push([e.target.value ? e.target.value : 0, course, classId, id]);
    setValue(a);
    console.log(value);
  };
  useEffect(() => {
    http.get(`/course/${course}`).then(res => {
      setCourseName(res.data[0].name);
      console.log(res.data[0].name);
    });
  }, []);
  return (
    <>
      <img className={styles.logo} src="/backGroundLogo.png" alt="logo" />
      <Leave path={`/CourseDetails/${course}/${classId}`} />
      <header className={styles.header}>
        <Title style={{ margin: '8px 0' }}> {courseName} </Title>
        <div className={styles.topButtons}>
          <Button
            onClick={() => {
              setChangePointsButton(!changePointsButton);
              if (changePointsButton) {
                location.reload();
              }
            }}
            type="secondary"
            className={styles.button}
          >
            <IconEdit />
            {changePointsButton ? '确认分数' : '修改分数'}
          </Button>

          <Button
            onClick={() => {
              setChangeAttendance(true);
            }}
            type="secondary"
            className={styles.button}
          >
            <IconFile />
            修改考勤
          </Button>
        </div>
      </header>
      <Modal
        visible={changeAttendance}
        fullScreen
        title="添加考勤"
        motion={true}
        okText="确认"
        maskClosable={false}
        closeOnEsc={true}
        onOk={() => {
          handleOk().then(() => {
            http.get(`attendance/courses/${course}`).then(res => {
              console.log(res.data);
              console.log(transformData(res.data));
            });
          });
        }}
        onCancel={() => setChangeAttendance(false)}
      >
        <List
          dataSource={studentBackEnd}
          className={styles.inputList}
          renderItem={item => (
            <List.Item
              header={<Avatar color={'blue'}>{item.name}</Avatar>}
              main={
                <div className={styles.input}>
                  <RadioGroup
                    type="button"
                    buttonSize="large"
                    mode="advanced"
                    className={styles.radio}
                    onChange={e => {
                      changeState(e, item.id);
                    }}
                  >
                    <Radio value={1}>{status[1]}</Radio>
                    <Radio value={2}>{status[2]}</Radio>
                    <Radio value={3}>{status[3]}</Radio>
                  </RadioGroup>
                  <Input
                    prefix="备注："
                    size="large"
                    className={styles.inputAttendance}
                    showClear
                  ></Input>
                </div>
              }
            />
          )}
        />
      </Modal>
      <modal
        title="添加考勤"
        okText={'确认修改'}
        visible={changeAttendance}
        onOk={handleChangeAttendance}
        onCancel={() => setChangeAttendance(false)}
        closeOnEsc={true}
        maskClosable={false}
        motion
      ></modal>
      <Tabs className={styles.Tabs} type="line">
        <TabPane tab={'点名'} itemKey={'1'}>
          <div className={styles.tabChild}>
            <CallRollTab
              course={course}
              classId={classId}
              changePointsButton={changePointsButton}
              studentBackEnd={studentBackEnd}
              score={score}
            />
          </div>
        </TabPane>

        <TabPane tab={'分组'} itemKey={'2'}>
          <div className={styles.tabChild}>
            <MakeGroupTab
              course={course}
              classId={classId}
              changePointsButton={changePointsButton}
              studentBackEnd={studentBackEnd}
              score={score}
            />
          </div>
        </TabPane>
      </Tabs>
    </>
  );
}

export default App;
