import { Students } from '../CallRoll/components';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LeaveIcon as Leave } from '../atoms/index';
import {
  Button,
  List,
  Input,
  RadioGroup,
  Modal,
  Radio,
  Card,
  SideSheet,
  Avatar,
  Typography,
} from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { IconFile } from '@douyinfe/semi-icons';
import { attendanceModal as AttendanceList } from './attendance';
import { pointTable as PointsTable } from './pointTable';
import http from '../http';
import styles from './index.module.css';

function Course() {
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
  const [isAdd, setIsAdd] = useState(false);
  const [newStudent, setNewStudent] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isVisibleSideSheet, setIsVisibleSideSheet] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [showPointsList, setShowPointsList] = useState(false);
  const [remark, setRemark] = useState([]);
  const [value, setValue] = useState([]);
  const [specialAttendance, setSpecialAttendance] = React.useState([]);

  const [studentBackEnd, setStudentBackEnd] = useState();
  const { courseId: course, classId: classId } = useParams();
  const { Title } = Typography;
  const navigate = useNavigate();
  const status = {
    1: '迟到',
    2: '请假',
    3: '缺勤',
  };
  const session = {
    0: '上午',
    1: '下午',
  };
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
  const [courseName, setCourseName] = useState();

  useEffect(() => {
    http.get(`attendance/courses/${course}`).then(res => {
      setSpecialAttendance(transformData(res.data));
      // console.log(res.data);
      console.log(transformData(res.data));
    });
    http.get(`/course/${course}`).then(res => {
      setCourseName(res.data[0].name);
    });
  }, []);

  const change = () => {
    setIsVisibleSideSheet(false);
    setShowPointsList(false);
  };
  async function handleOk() {
    setIsAttendance(false);
    await Promise.all(
      value.map(async i => {
        return http.post(
          `/attendance/courses/${i[1]}/classes/${i[2]}/students/${i[3]}`,
          {
            status: i[0],
          },
        );
      }),
    );
  }
  const addStudent = () => {
    setIsAdd(false);
    http.post(`/student/addStudents/${course}`, { name: newStudent });
    location.reload();
  };
  const changeState = (e, id) => {
    let a = value;
    a.push([e.target.value ? e.target.value : 0, course, classId, id]);
    setValue(a);
  };
  return (
    <>
      <img className={styles.logo} src="/backGroundLogo.png" alt="logo" />
      <Leave path={'/Courses'} />

      <Modal
        fullScreen
        visible={isAttendance}
        title="添加考勤"
        motion={true}
        okText="确认"
        maskClosable={false}
        closeOnEsc={true}
        onOk={() => {
          handleOk().then(() => {
            http.get(`attendance/courses/${course}`).then(res => {
              setSpecialAttendance(transformData(res.data));
              console.log(res.data);
              console.log(transformData(res.data));
            });
          });
        }}
        onCancel={() => setIsAttendance(false)}
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
                    <Radio value={1}>
                      <div>{status[1]}</div>
                    </Radio>
                    <Radio value={2}>
                      <div>{status[2]}</div>
                    </Radio>
                    <Radio value={3}>
                      <div>{status[3]}</div>
                    </Radio>
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
      <Modal
        visible={isAdd}
        title="添加学生"
        motion={true}
        okText="添加"
        onCancel={() => setIsAdd(false)}
        onOk={() => addStudent()}
        maskClosable={false}
        closeOnEsc={true}
      >
        <Input
          placeholder="学生名称"
          onChange={text => {
            setNewStudent(text);
          }}
        ></Input>
      </Modal>
      <div className={styles.topTab}>
        <Title style={{ margin: '8px 0' }}> {courseName} </Title>
        <div className={styles.topButtons}>
          <Button
            className={styles.topButton}
            onClick={() => {
              setIsAdd(true);
            }}
          >
            添加学生
          </Button>
          <Button
            className={styles.topButton}
            onClick={() => {
              setIsDelete(!isDelete);
            }}
            type={isDelete ? 'danger' : 'primary'}
          >
            {isDelete ? '完成修改' : '编辑学生'}
          </Button>
        </div>
      </div>
      <Students
        studentBackEnd={studentBackEnd}
        isGroup={true}
        isDelete={isDelete}
        changePointsButton={false}
        course={course}
        classId={classId}
        score={score}
      />
      <div className={styles.cardList}>
        <Card className={styles.card}>
          <div className={styles.cardText}>
            <img className={styles.Icon} src="/enter.svg" />
            <div className={styles.title}>
              <h2>上课</h2>
              <Button
                className={styles.button}
                onClick={() => {
                  navigate(`/callRoll/${course}/${classId}`);
                }}
                style={{
                  color: 'white',
                }}
              >
                进入课程
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardText}>
            <img className={styles.Icon} src="/attendance.svg" />
            <div className={styles.title}>
              <h2>考勤</h2>
              <Button
                className={styles.button}
                onClick={() => setIsVisibleSideSheet(!isVisibleSideSheet)}
                style={{
                  color: 'white',
                }}
              >
                进入考勤
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardText}>
            <img className={styles.Icon} src="/score.svg" />
            <div className={styles.title}>
              <h2>统计</h2>
              <Button
                style={{
                  color: 'white',
                }}
                className={styles.button}
                onClick={() => setShowPointsList(true)}
              >
                记分统计
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <SideSheet visible={isVisibleSideSheet} onCancel={change} size={'large'}>
        <div style={{ display: 'flex' }}>
          <Title>今日考勤</Title>
          <Button
            onClick={() => setIsAttendance(!isAttendance)}
            className={styles.buttonSide}
          >
            <IconFile />
            添加考勤
          </Button>
        </div>
        <AttendanceList specialAttendance={specialAttendance} />
      </SideSheet>

      <SideSheet visible={showPointsList} onCancel={change} size={'large'}>
        <Title>记分考勤</Title>

        <PointsTable courseId={course} />
      </SideSheet>
    </>
  );
}

export default Course;
