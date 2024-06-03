import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Button, Modal } from '@douyinfe/semi-ui';
import { upstateStudents } from './upstateStudents';
import { Students } from './components';
import http from '../http';
import { useNavigate } from 'react-router-dom';

export function CallRollTab({ course, changePointsButton }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [randomStudent, setRandomStudent] = useState();
  const [randomStudentPoints, setRandomStudentPoints] = useState();
  const [numStudentsChoose, setNumStudentsChoose] = useState();
  const [studentBackEnd, setStudentBackEnd] = useState();
  const { data: students, mutate } = useSWR(
    `http://localhost:4000/${course}`,
    url => axios.get(url).then(res => res.data),
  );
  async function getStudent() {
    try {
      const student = await http.get(
        `http://localhost:5050/student/studentCourse/${course}`,
      );
      return student.data;
    } catch (error) {
      console.error('Error fetching student course:', error);
      throw error;
    }
  }

  useEffect(() => {
    getStudent()
      .then(student => {
        setStudentBackEnd(student);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  function callName() {
    let numStudents = studentBackEnd.length;
    setModalOpen(true);
    mutate().then(() => {
      let randomNum = Math.floor(Math.random() * numStudents);

      while (students[randomNum]['isCall']) {
        randomNum = Math.floor(Math.random() * numStudents);
      }
      upstateStudents(`http://localhost:4000/${course}/${randomNum}`, {
        isCall: true,
      });
      setNumStudentsChoose(randomNum);
      setRandomStudent(students[randomNum]['name']);
      setRandomStudentPoints(students[randomNum]['points']);
      let studentsNotCall = numStudents;
      for (let i = 0; i < numStudents; i++) {
        if (students[i]['isCall']) {
          studentsNotCall--;
        }
      }
      if (studentsNotCall === 1) {
        for (let j = 0; j < numStudents; j++) {
          upstateStudents(`http://localhost:4000/${course}/${j}`, {
            isCall: false,
          });
        }
      }
    });
  }

  function changePoints() {
    setModalOpen(false);
    const selectedStudent = students[numStudentsChoose];
    upstateStudents(`http://localhost:4000/${course}/${numStudentsChoose}`, {
      points: selectedStudent.points + 1,
    });
    mutate();
  }

  function closeModal() {
    setModalOpen(false);
    mutate();
  }

  const style = {
    border: '0',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '0',
  };
  return (
    <>
      <Students
        students={studentBackEnd}
        isGroup={false}
        changePointsButton={changePointsButton}
        course={course}
        isDelete={false}
      />
      <Button
        theme="solid"
        type="primary"
        style={{ marginRight: 8 }}
        onClick={callName}
        disabled={changePointsButton}
      >
        随机点名
      </Button>
      <Modal
        title="幸运儿"
        visible={modalOpen}
        footerFill={true}
        onOk={changePoints}
        onCancel={closeModal}
        okText={'加分!'}
        cancelText={'答错了'}
        maskClosable={false}
        closeOnEsc={true}
        motion
      >
        {randomStudent}
        <br />
        当前分数：{randomStudentPoints}分
        {/*<InputNumber min={1} max={10} defaultValue={1} onchange={newValue=>{setChangeScoreValue(newValue)}}/>*/}
      </Modal>
    </>
  );
}
