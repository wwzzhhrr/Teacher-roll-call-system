import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@douyinfe/semi-ui';
import { Students } from './components';
import http from '../http';
import styles from './index.module.css';

export function CallRollTab({
  course,
  classId,
  changePointsButton,
  studentBackEnd,
  score,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [randomStudent, setRandomStudent] = useState();
  const [numStudentsChoose, setNumStudentsChoose] = useState();
  function callName() {
    let numStudents = studentBackEnd.length;
    console.log(studentBackEnd);
    setModalOpen(true);
    let randomNum = Math.floor(Math.random() * numStudents);

    while (
      studentBackEnd[randomNum].is_call ||
      !studentBackEnd[randomNum].is_come
    ) {
      randomNum = Math.floor(Math.random() * numStudents);
    }
    http.get(`student/is_call/${randomNum + 1}/${course}`);
    setNumStudentsChoose(randomNum);
    setRandomStudent(studentBackEnd[randomNum]['name']);
    console.log(randomNum);
    let studentsNotCall = numStudents;
    for (let i = 0; i < numStudents; i++) {
      if (studentBackEnd[i].is_call || !studentBackEnd[i].is_come) {
        studentsNotCall--;
      }
    }
    if (studentsNotCall === 1) {
      http.get(`/student/recall/${course}`, {});
    }
  }

  function changePoints() {
    setModalOpen(false);
    console.log(numStudentsChoose);
    http
      .post(
        `/score/courses/${course}/classes/${classId}/students/${numStudentsChoose + 1}`,
        {
          score:
            (score[numStudentsChoose + 1] ? score[numStudentsChoose + 1] : 0) +
            1,
        },
      )
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    location.reload();
  }

  function closeModal() {
    setModalOpen(false);
    location.reload();
  }
  return (
    <>
      <Students
        studentBackEnd={studentBackEnd}
        isGroup={false}
        changePointsButton={changePointsButton}
        course={course}
        isDelete={false}
        classId={classId}
        score={score}
      />
      <Button
        size="large"
        onClick={callName}
        disabled={changePointsButton}
        className={styles.callButton}
      >
        随机点名
      </Button>
      <Modal
        title="幸运儿"
        visible={modalOpen}
        footerFill={true}
        onOk={changePoints}
        onCancel={closeModal}
        okText={'加一分!'}
        cancelText={'答错了'}
        maskClosable={false}
        closeOnEsc={true}
        motion
      >
        {randomStudent}
        <br />
        {/*<InputNumber min={1} max={10} defaultValue={1} onchange={newValue=>{setChangeScoreValue(newValue)}}/>*/}
      </Modal>
    </>
  );
}
