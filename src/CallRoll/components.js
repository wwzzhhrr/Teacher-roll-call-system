import { Descriptions, InputNumber, List, Spin } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { IconDelete } from '@douyinfe/semi-icons';
import http from '../http';
import { useParams } from 'react-router-dom';
import styles from './index.module.css';

export function Students({
  course,
  classId,
  studentBackEnd,
  score,
  isGroup,
  changePointsButton,
  isDelete,
}) {
  const deleteStudent = (id, name) => {
    http.delete(`/student/${course}/students/${id}`);
    console.log(`deleting ${name}`);
    location.reload();
  };
  const setIsCome = (isCome, id) => {
    http.post(`/student/is_come/${id}/${course}`, {
      isCome: isCome ? 0 : 1,
    });
    location.reload();
  };
  return (
    <>
      {Array.isArray(studentBackEnd) ? (
        <List
          grid={{
            gutter: 12,
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
            xl: 6,
            xxl: 3,
          }}
          dataSource={studentBackEnd}
          renderItem={item => (
            <List.Item
              onClick={() => {
                console.log(item.is_come);
                if (!changePointsButton) {
                  setIsCome(item.is_come, item.id);
                }
              }}
              className={
                item.is_come ? styles.studentsList : styles.studentsListNotCome
              }
              style={{
                padding: '18px 0 10px 20px',
              }}
            >
              <div>
                {item.is_come ? (
                  <h2
                    style={{
                      color: 'var(--semi-color-text-0)',
                      fontWeight: 500,
                      margin: '0 0 5px',
                    }}
                  >
                    {!isGroup && item.is_call ? '😇' : ''}
                    {item.name}
                    {isDelete ? (
                      <IconDelete
                        className={styles.delete}
                        onClick={() => {
                          deleteStudent(item.id, item.name);
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </h2>
                ) : (
                  <h2
                    style={{
                      color: 'gray',
                      fontWeight: 500,
                      margin: '0 0 5px',
                    }}
                  >
                    {item.name}
                  </h2>
                )}
                {changePointsButton ? (
                  <InputNumber
                    defaultValue={score[item.id] ? score[item.id] : 0}
                    onChange={num => {
                      http
                        .post(
                          `/score/courses/${course}/classes/${classId}/students/${item.id}`,
                          {
                            score: num - (score[item.id] ? score[item.id] : 0),
                          },
                        )
                        .then(response => {
                          console.log('Response:', response.data);
                        })
                        .catch(error => {
                          console.error('Error:', error);
                        });
                    }}
                  />
                ) : (
                  <Descriptions
                    align="center"
                    row
                    data={[
                      {
                        key: '分数',
                        value: score[item.id] ? score[item.id] : 0,
                      },
                    ]}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Spin />
      )}
    </>
  );
}
